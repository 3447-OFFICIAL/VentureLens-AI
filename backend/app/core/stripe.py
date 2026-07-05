import stripe
from .config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(customer_id: str, price_id: str, success_url: str, cancel_url: str):
    """
    Generate a Stripe Checkout Session URL for new subscriptions or seat additions.
    Allows coupons and tax ID collection natively.
    """
    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=['card'],
        line_items=[{
            'price': price_id,
            'quantity': 1,
        }],
        mode='subscription',
        success_url=success_url,
        cancel_url=cancel_url,
        allow_promotion_codes=True,
        tax_id_collection={"enabled": True},
        subscription_data={
            "trial_period_days": 14 # Default 14-day trial
        }
    )
    return session.url

def create_billing_portal_session(customer_id: str, return_url: str):
    """
    Generate a Stripe Customer Portal URL for users to manage cards/invoices.
    """
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url,
    )
    return session.url

def report_ai_usage(subscription_item_id: str, tokens_consumed: int):
    """
    Report metered AI usage to Stripe for overage billing.
    Usually called asynchronously via Celery.
    """
    # Assuming $0.001 per token as a placeholder for metered billing math
    stripe.SubscriptionItem.create_usage_record(
        subscription_item_id,
        quantity=tokens_consumed,
        timestamp="now",
        action="increment",
    )
