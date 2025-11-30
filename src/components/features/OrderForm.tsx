import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formFields } from "@/constants";

interface OrderFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: (data: any) => void;
  dates: {
    orderDate: Date | null;
    poDate: Date | null;
    dueDate: Date | null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDates: (dates: any) => void;
  customers: string[];
  onFocusNext?: () => void;
  measurementRef?: React.MutableRefObject<HTMLInputElement | null>;
}

// Custom input for DatePicker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDateInput = React.forwardRef(({ value, onClick, onKeyDown, manualRef, manualOnKeyDown, manualOnFocus }: any, ref: any) => (
  <div className="flex items-center space-x-2 min-w-0">
      <input
      ref={(el) => {
          // Forward ref from DatePicker
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
          
          // Manual ref for navigation
          if (manualRef) manualRef(el);
      }}
      type="text"
      value={value}
      onClick={onClick}
      onFocus={(e) => {
          if (manualOnFocus) manualOnFocus(e);
      }}
      onKeyDown={(e) => {
          if (onKeyDown) onKeyDown(e);
          if (manualOnKeyDown) manualOnKeyDown(e);
      }}
      className="flex-1 px-2 py-1 border border-gray-400 rounded text-sm bg-white min-w-0 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      readOnly
      />
  </div>
));
CustomDateInput.displayName = "CustomDateInput";

export const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  setFormData,
  dates,
  setDates,
  customers,
  onFocusNext,
  measurementRef,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [datePickerOpen, setDatePickerOpen] = useState<string | null>(null);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [measurementDropdownOpen, setMeasurementDropdownOpen] = useState(false);
  const formInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDateChange = (key: string, date: Date | null) => {
    setDates({ ...dates, [key]: date });
    setDatePickerOpen(null);
    
    // Auto-focus next field after date selection (delayed to allow render)
    setTimeout(() => {
        const index = formFields.findIndex(f => f.key === key);
        const nextIndex = index + 1;
        if (formInputRefs.current[nextIndex]) {
            formInputRefs.current[nextIndex]?.focus();
        }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      const currentField = formFields[index];

      // If date picker is open for this field, close it and move to next
      if (datePickerOpen === currentField.key) {
        setDatePickerOpen(null);
        const nextIndex = index + 1;
        if (formInputRefs.current[nextIndex]) {
          formInputRefs.current[nextIndex]?.focus();
        } else if (onFocusNext) {
            onFocusNext();
        }
        return;
      }

      // If this is a date field and picker is NOT open, open it
      if (currentField.type === "date") {
        setDatePickerOpen(currentField.key);
        setCustomerDropdownOpen(false);
        setMeasurementDropdownOpen(false);
        return;
      }

      // For non-date fields, or if we just want to move next (generic fallback)
      const nextIndex = index + 1;
      if (formFields[nextIndex]) {
        const nextField = formFields[nextIndex];
        const nextRef = formInputRefs.current[nextIndex];

        if (nextRef) {
          nextRef.focus();

          if (nextField.type === "dropdown") {
            if (nextField.key === "customer") {
              setCustomerDropdownOpen(true);
              setMeasurementDropdownOpen(false);
            } else if (nextField.key === "measurement") {
              setCustomerDropdownOpen(false);
              setMeasurementDropdownOpen(true);
            } else {
              setMeasurementDropdownOpen(false);
              setCustomerDropdownOpen(false);
            }
          } else if (nextField.type === "date") {
            // Do NOT auto-open date picker on focus
            setDatePickerOpen(null); 
            setCustomerDropdownOpen(false);
            setMeasurementDropdownOpen(false);
          }
        }
      } else {
          // End of form - Navigate to next section (Product Table)
          setMeasurementDropdownOpen(false);
          setCustomerDropdownOpen(false);
          setDatePickerOpen(null);
          if (onFocusNext) {
            onFocusNext();
          }
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const isCustomer = formFields[index].key === "customer";
      const isMeasurement = formFields[index].key === "measurement";
      const isDate = formFields[index].type === "date";

      // Check if dropdown or date picker is open
      const isOpen =
        (isCustomer && customerDropdownOpen) ||
        (isMeasurement && measurementDropdownOpen) ||
        (isDate && datePickerOpen === formFields[index].key);

      if (!isOpen) {
        e.preventDefault();
        if (e.key === "ArrowDown") {
            const nextIndex = index + 1;
            if (formInputRefs.current[nextIndex]) {
                formInputRefs.current[nextIndex]?.focus();
            } else {
                // End of form - Navigate to next section
                if (onFocusNext) onFocusNext();
            }
        } else {
            // Arrow Up
            const prevIndex = index - 1;
            if (formInputRefs.current[prevIndex]) {
                formInputRefs.current[prevIndex]?.focus();
            }
        }
      }
      // If open, let the component handle the arrow keys (Select/DatePicker)
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderField = (field: any, index: number) => {
    if (field.type === "dropdown") {
      const isOpen = field.key === "customer" ? customerDropdownOpen : measurementDropdownOpen;
      const setOpen = field.key === "customer" ? setCustomerDropdownOpen : setMeasurementDropdownOpen;
      
      // Use customers prop for customer field, otherwise use field.options
      const options = field.key === "customer" ? customers : (field.options || []);
      
      return (
        <Select
          key={field.key}
          ref={(el) => { 
              formInputRefs.current[index] = el;
              if (field.key === "measurement" && measurementRef) {
                  measurementRef.current = el;
              }
          }}
          label={field.label}
          value={formData[field.key]}
          options={options}
          onChange={(val) => {
              setFormData({ ...formData, [field.key]: val });
              // On selection, we might want to close and move next?
              // The Select component handles close on Enter.
              // We just need to ensure focus moves next via handleKeyDown
          }}
          containerClassName={field.grid}
          labelClassName={field.width}
          onKeyDown={(e) => handleKeyDown(e, index)}
          isOpen={isOpen}
          onOpenChange={setOpen}
          onFocus={() => {
              // setOpen(true); // Don't auto open
              // Close others
              if (field.key === "customer") setMeasurementDropdownOpen(false);
              else setCustomerDropdownOpen(false);
              setDatePickerOpen(null);
          }}
        />
      );
    }

    if (field.type === "date") {
      return (
        <div key={field.key} className={`flex items-center space-x-2 min-w-0 ${field.grid}`}>
          <label className={`text-sm font-semibold text-blue-900 ${field.width}`}>
            {field.label}
          </label>
          <div className="flex-1 relative">
            <DatePicker
              selected={dates[field.key as keyof typeof dates]}
              onChange={(date) => handleDateChange(field.key, date)}
              dateFormat="dd/MM/yyyy"
              customInput={
                  <CustomDateInput 
                    manualRef={(el: HTMLInputElement) => { formInputRefs.current[index] = el; }} 
                    manualOnKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, index)}
                    manualOnFocus={() => {
                        // Don't auto-open on focus
                        setCustomerDropdownOpen(false);
                        setMeasurementDropdownOpen(false);
                    }}
                  />
              }
              showPopperArrow={false}
              popperClassName="!z-20"
              calendarClassName="!border !border-gray-400 !rounded !shadow-lg"
              dayClassName={(date) =>
                date.getDate() === dates[field.key as keyof typeof dates]?.getDate() &&
                date.getMonth() === dates[field.key as keyof typeof dates]?.getMonth()
                  ? "!bg-blue-500 !text-white"
                  : "hover:!bg-blue-100"
              }
              open={datePickerOpen === field.key}
              onFocus={() => {
                  // Don't auto-open on focus
                  setCustomerDropdownOpen(false);
                  setMeasurementDropdownOpen(false);
              }}
              onClickOutside={() => setDatePickerOpen(null)}
            />
          </div>
        </div>
      );
    }

    return (
      <Input
        key={field.key}
        ref={(el) => { formInputRefs.current[index] = el; }}
        label={field.label}
        value={formData[field.key]}
        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
        containerClassName={field.grid}
        labelClassName={field.width}
        onKeyDown={(e) => handleKeyDown(e, index)}
      />
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-4 border-x-2 border-blue-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {formFields.slice(0, 3).map((field, i) => renderField(field, i))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {formFields.slice(3).map((field, i) => renderField(field, i + 3))}
      </div>
    </div>
  );
};
