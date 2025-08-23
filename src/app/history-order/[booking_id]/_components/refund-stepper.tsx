'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefundStatus } from '@/interfaces/refunds.interface';
import { convertISOToCurrentTimezone, formatCurrency } from '@/lib/utils';

interface RefundStepperProps {
  refund: any;
  bookingId: string;
}

export function RefundStepper({ refund, bookingId }: RefundStepperProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case RefundStatus.WAITING_FORM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RefundStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case RefundStatus.SUCCESS:
        return 'bg-green-100 text-green-800 border-green-200';
      case RefundStatus.FAILED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStepStatus = (
    currentStatus: RefundStatus,
    stepStatus: RefundStatus
  ) => {
    const statusOrder = [
      RefundStatus.WAITING_FORM,
      RefundStatus.PROCESSING,
      RefundStatus.SUCCESS,
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    if (stepIndex === 2) return 'completed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const steps = [
    {
      status: RefundStatus.WAITING_FORM,
      label: 'Form Submission',
      description: 'Submit refund form',
    },
    {
      status: RefundStatus.PROCESSING,
      label: 'Processing',
      description: 'Refund is being processed',
    },
    {
      status: RefundStatus.SUCCESS,
      label: 'Completed',
      description: 'Refund has been processed',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Refund Information
          <Badge className={getStatusBadgeClass(refund.status)}>
            {refund.status.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Refund Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Refund Amount:</span>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(parseFloat(refund.amount))}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Refund Method:</span>
              <p className="text-gray-900">{refund.method}</p>
            </div>
            {refund.bank_name && (
              <>
                <div>
                  <span className="font-medium text-gray-700">Bank Name:</span>
                  <p className="text-gray-900">{refund.bank_name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Account Number:
                  </span>
                  <p className="text-gray-900">{refund.account_number}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Account Name:
                  </span>
                  <p className="text-gray-900">{refund.account_name}</p>
                </div>
              </>
            )}
            <div>
              <span className="font-medium text-gray-700">Reason:</span>
              <p className="text-gray-900">{refund.reason}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Refund Request Date:
              </span>
              <p className="text-gray-900">
                {new Date(
                  convertISOToCurrentTimezone(refund.created_at)
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-6">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => {
                const stepStatus = getStepStatus(refund.status, step.status);

                return (
                  <div key={step.status} className="flex items-center">
                    {/* Step Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        stepStatus === 'completed'
                          ? 'bg-green-500 text-white'
                          : stepStatus === 'current'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {stepStatus === 'completed' ? '✓' : index + 1}
                    </div>

                    {/* Connecting Line (except for last step) */}
                    {index < steps.length - 1 && (
                      <div
                        className={`w-20 h-1 mx-4 ${
                          stepStatus === 'completed'
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Labels Below */}
            <div className="flex justify-between mt-4 px-2">
              {steps.map((step, index) => {
                const stepStatus = getStepStatus(refund.status, step.status);

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center text-center"
                    style={{ width: '120px' }}
                  >
                    <p
                      className={`text-sm font-medium ${
                        stepStatus === 'completed'
                          ? 'text-green-600'
                          : stepStatus === 'current'
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
