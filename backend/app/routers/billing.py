from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import stripe
from pydantic import BaseModel

from ..core.database import get_db
from ..api.deps import get_current_user
from ..models.user import User
from ..models.billing import Subscription, Invoice
from ..core.stripe import create_checkout_session, create_billing_portal_session
from ..core.config import settings

router = APIRouter(prefix="/billing", tags=["billing"])

class CheckoutRequest(BaseModel):
    price_id: str

@router.post("/checkout")
async def checkout(
    req: CheckoutRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate a Stripe Checkout Session for the current user's organization.
    """
    result = await db.execute(select(Subscription).filter(Subscription.tenant_id == current_user.tenant_id))
    sub = result.scalars().first()
    
    if not sub or not sub.stripe_customer_id:
        raise HTTPException(status_code=400, detail="Organization has no Stripe Customer ID")

    url = create_checkout_session(
        customer_id=sub.stripe_customer_id,
        price_id=req.price_id,
        success_url=f"{settings.FRONTEND_URL}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{settings.FRONTEND_URL}/pricing"
    )
    return {"url": url}

@router.post("/portal")
async def customer_portal(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate a Stripe Customer Portal link.
    """
    result = await db.execute(select(Subscription).filter(Subscription.tenant_id == current_user.tenant_id))
    sub = result.scalars().first()
    
    if not sub or not sub.stripe_customer_id:
        raise HTTPException(status_code=400, detail="Organization has no Stripe Customer ID")

    url = create_billing_portal_session(
        customer_id=sub.stripe_customer_id,
        return_url=f"{settings.FRONTEND_URL}/dashboard/billing"
    )
    return {"url": url}

@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Secure webhook endpoint for Stripe to report subscription updates and paid invoices.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'invoice.payment_succeeded':
        pass
    elif event['type'] == 'customer.subscription.updated':
        pass
    
    return {"status": "success"}
