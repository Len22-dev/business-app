import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, FormProvider, UseFormReturn, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

interface ModalFormProps<T extends Record<string, unknown>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  schema: ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => Promise<void> | void;
  footer?: (args: { isSubmitting: boolean }) => React.ReactNode;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  className?: string;
}

function ModalForm<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  footer,
  children,
  className,
}: ModalFormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = methods;

  React.useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className || 'sm:max-w-[425px]'}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(async (values) => {
              await onSubmit(values);
            })}
            className="space-y-4"
          >
            {typeof children === 'function' ? children(methods) : children}
            {footer && <DialogFooter>{footer({ isSubmitting })}</DialogFooter>}
            {Object.keys(errors).length > 0 && (
              <div className="text-red-500 text-sm pt-2">
                {Object.entries(errors).map(([key, err]) => (
                  <div key={key}>{err?.message as string}</div>
                ))}
              </div>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default ModalForm;
