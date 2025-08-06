import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, CreditCard, Lock } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  gigId: string;
  amount: number;
  gigTitle: string;
}

const CheckoutForm: React.FC<{ gigId: string; amount: number; onSuccess: () => void; onClose: () => void }> = ({ 
  gigId, 
  amount, 
  onSuccess, 
  onClose 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment intent
      const response = await api.post('/orders/create-payment-intent', { gigId });
      const { clientSecret, orderId } = response.data;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        // Update payment status
        await api.put('/orders/update-payment', {
          orderId,
          payment_intent: paymentIntent.id,
        });
        
        toast.success('Payment successful!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Lock size={16} />
          <span>Secure payment powered by Stripe</span>
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn-primary flex items-center space-x-2"
        >
          <CreditCard size={16} />
          <span>{loading ? 'Processing...' : `Pay $${amount}`}</span>
        </button>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, gigId, amount, gigTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{gigTitle}</h3>
            <p className="text-2xl font-bold text-primary-600">${amount}</p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              gigId={gigId}
              amount={amount}
              onSuccess={() => {
                // Handle success - maybe redirect to orders page
                window.location.href = '/orders';
              }}
              onClose={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 