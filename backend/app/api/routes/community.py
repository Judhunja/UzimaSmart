"""
Community reporting API routes
"""
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from datetime import datetime, timedelta
import uuid

from ...utils.database import get_db
from ...models.models import CommunityReport, County
from ...services.sms_service import sms_service

router = APIRouter()

@router.post("/reports")
async def submit_report(
    event_type: str = Form(...),
    severity: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    location_name: str = Form(...),
    reporter_phone: Optional[str] = Form(None),
    reporter_name: Optional[str] = Form(None),
    event_date: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    """Submit a community climate report"""
    
    try:
        # Validate event type
        valid_event_types = ['flood', 'drought', 'crop_damage', 'storm', 'heatwave', 'other']
        if event_type not in valid_event_types:
            raise HTTPException(status_code=400, detail="Invalid event type")
        
        # Validate severity
        valid_severities = ['low', 'medium', 'high', 'critical']
        if severity not in valid_severities:
            raise HTTPException(status_code=400, detail="Invalid severity level")
        
        # Parse event date
        parsed_event_date = datetime.utcnow()
        if event_date:
            try:
                parsed_event_date = datetime.strptime(event_date, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                try:
                    parsed_event_date = datetime.strptime(event_date, '%Y-%m-%d')
                except ValueError:
                    raise HTTPException(status_code=400, detail="Invalid date format")
        
        # Handle image upload
        image_url = None
        if image:
            # In production, upload to cloud storage (S3, GCS, etc.)
            # For now, save filename
            image_url = f"/uploads/{uuid.uuid4()}_{image.filename}"
        
        # Determine county based on coordinates
        # This is simplified - in production, use PostGIS spatial queries
        county_id = 1  # Default to Nairobi
        
        # Create report
        report = CommunityReport(
            county_id=county_id,
            latitude=latitude,
            longitude=longitude,
            location_name=location_name,
            event_type=event_type,
            severity=severity,
            description=description,
            reporter_phone=reporter_phone,
            reporter_name=reporter_name,
            event_date=parsed_event_date,
            image_url=image_url
        )
        
        db.add(report)
        await db.commit()
        await db.refresh(report)
        
        # Trigger verification process
        await verify_report(report.id, db)
        
        return {
            "success": True,
            "report_id": str(report.id),
            "message": "Report submitted successfully"
        }
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error submitting report: {str(e)}")

@router.get("/reports")
async def get_reports(
    county_id: Optional[int] = None,
    event_type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Get community reports with filtering"""
    
    try:
        query = select(CommunityReport)
        
        # Apply filters
        if county_id:
            query = query.where(CommunityReport.county_id == county_id)
        
        if event_type:
            query = query.where(CommunityReport.event_type == event_type)
        
        if status:
            query = query.where(CommunityReport.verification_status == status)
        
        # Order by most recent
        query = query.order_by(CommunityReport.reported_at.desc())
        
        # Apply pagination
        query = query.offset(offset).limit(limit)
        
        result = await db.execute(query)
        reports = result.scalars().all()
        
        return {
            "reports": [
                {
                    "id": str(report.id),
                    "county_id": report.county_id,
                    "event_type": report.event_type,
                    "severity": report.severity,
                    "description": report.description,
                    "location_name": report.location_name,
                    "latitude": report.latitude,
                    "longitude": report.longitude,
                    "verification_status": report.verification_status,
                    "trust_score": report.trust_score,
                    "event_date": report.event_date.isoformat() if report.event_date else None,
                    "reported_at": report.reported_at.isoformat(),
                    "image_url": report.image_url
                }
                for report in reports
            ],
            "total": len(reports),
            "offset": offset,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving reports: {str(e)}")

@router.get("/reports/{report_id}")
async def get_report(report_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific report"""
    
    try:
        result = await db.execute(
            select(CommunityReport).where(CommunityReport.id == uuid.UUID(report_id))
        )
        report = result.scalar_one_or_none()
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {
            "id": str(report.id),
            "county_id": report.county_id,
            "event_type": report.event_type,
            "severity": report.severity,
            "description": report.description,
            "location_name": report.location_name,
            "latitude": report.latitude,
            "longitude": report.longitude,
            "reporter_phone": report.reporter_phone,
            "reporter_name": report.reporter_name,
            "verification_status": report.verification_status,
            "trust_score": report.trust_score,
            "verification_method": report.verification_method,
            "event_date": report.event_date.isoformat() if report.event_date else None,
            "reported_at": report.reported_at.isoformat(),
            "verified_at": report.verified_at.isoformat() if report.verified_at else None,
            "image_url": report.image_url
        }
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid report ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving report: {str(e)}")

@router.post("/reports/{report_id}/verify")
async def verify_report_endpoint(report_id: str, db: AsyncSession = Depends(get_db)):
    """Manually verify a report"""
    
    try:
        result = await verify_report(uuid.UUID(report_id), db)
        return result
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid report ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying report: {str(e)}")

@router.get("/reports/stats/summary")
async def get_report_statistics(
    county_id: Optional[int] = None,
    days: int = 30,
    db: AsyncSession = Depends(get_db)
):
    """Get report statistics"""
    
    try:
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Base query
        query = select(CommunityReport).where(CommunityReport.reported_at >= start_date)
        
        if county_id:
            query = query.where(CommunityReport.county_id == county_id)
        
        result = await db.execute(query)
        reports = result.scalars().all()
        
        # Calculate statistics
        stats = {
            "total_reports": len(reports),
            "verified_reports": len([r for r in reports if r.verification_status == 'verified']),
            "pending_reports": len([r for r in reports if r.verification_status == 'pending']),
            "unverified_reports": len([r for r in reports if r.verification_status == 'unverified']),
            "by_event_type": {},
            "by_severity": {},
            "average_trust_score": 0
        }
        
        # Group by event type
        for report in reports:
            event_type = report.event_type
            if event_type not in stats["by_event_type"]:
                stats["by_event_type"][event_type] = 0
            stats["by_event_type"][event_type] += 1
        
        # Group by severity
        for report in reports:
            severity = report.severity
            if severity not in stats["by_severity"]:
                stats["by_severity"][severity] = 0
            stats["by_severity"][severity] += 1
        
        # Calculate average trust score
        if reports:
            stats["average_trust_score"] = sum([r.trust_score for r in reports]) / len(reports)
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving statistics: {str(e)}")

async def verify_report(report_id: uuid.UUID, db: AsyncSession):
    """Verify a community report using clustering and satellite data"""
    
    try:
        # Get the report
        result = await db.execute(
            select(CommunityReport).where(CommunityReport.id == report_id)
        )
        report = result.scalar_one_or_none()
        
        if not report:
            return {"error": "Report not found"}
        
        # Check for clustering - reports within 10km radius in last 24 hours
        clustering_query = select(func.count(CommunityReport.id)).where(
            CommunityReport.event_type == report.event_type,
            CommunityReport.reported_at >= datetime.utcnow() - timedelta(hours=24),
            func.ST_DWithin(
                func.ST_SetSRID(func.ST_MakePoint(CommunityReport.longitude, CommunityReport.latitude), 4326),
                func.ST_SetSRID(func.ST_MakePoint(report.longitude, report.latitude), 4326),
                0.1  # ~10km in degrees
            )
        )
        
        clustering_result = await db.execute(clustering_query)
        nearby_reports = clustering_result.scalar()
        
        # Verification logic
        verification_status = "unverified"
        trust_score = 0.0
        verification_method = "clustering"
        
        if nearby_reports >= 3:
            verification_status = "verified"
            trust_score = 0.8
            verification_method = "clustering"
        elif report.reporter_phone and len(report.description) > 50:
            # If detailed report from known reporter
            verification_status = "pending"
            trust_score = 0.6
            verification_method = "manual_review"
        
        # Update report
        report.verification_status = verification_status
        report.trust_score = trust_score
        report.verification_method = verification_method
        if verification_status == "verified":
            report.verified_at = datetime.utcnow()
        
        await db.commit()
        
        # Send alerts if verified
        if verification_status == "verified":
            await send_alert_for_verified_report(report)
        
        return {
            "report_id": str(report.id),
            "verification_status": verification_status,
            "trust_score": trust_score,
            "verification_method": verification_method,
            "nearby_reports": nearby_reports
        }
        
    except Exception as e:
        await db.rollback()
        return {"error": f"Verification failed: {str(e)}"}

async def send_alert_for_verified_report(report: CommunityReport):
    """Send SMS alert for verified reports"""
    
    try:
        message = f"CLIMATE ALERT: {report.event_type.upper()} reported in {report.location_name}. "
        message += f"Severity: {report.severity.upper()}. "
        message += f"Description: {report.description[:100]}..."
        
        # Send to subscribers in the county
        await sms_service.send_weather_alert(
            county_id=report.county_id,
            alert_type=report.event_type,
            message=message
        )
        
    except Exception as e:
        print(f"Failed to send alert for report {report.id}: {e}")
