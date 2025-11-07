'use client';

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
  FocusEvent,
  MouseEvent,
} from 'react';
import {
  FaEyeSlash,
  FaSearch,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
} from 'react-icons/fa';

type InputName =
  | 'phone'
  | 'cnpj'
  | 'postalCode'
  | 'email'
  | 'password'
  | 'date'
  | 'only-numbers'
  | 'search'
  | 'custom';

type InputType =
  | 'search'
  | 'text'
  | 'password'
  | 'number'
  | 'date'
  | 'datetime-local';

type ValidationType = 'initial' | 'success' | 'failure';

export interface InputProps {
  inputName: InputName;
  id?: string;
  value?: string;
  initialInputList?: string[];
  isDisabled?: boolean;
  borderType?: ValidationType;
  inputClass?: string;
  placeholder?: string;
  type?: InputType;
  borderClass?: string;
  tabIndex?: number;
  min?: number;
  className?: string;
  onChange?: (value: string) => void;
  onKeydown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onIconClick?: () => void;
}

const EMPTY_ARRAY: string[] = [];

export function Input({
  inputName = 'custom',
  id,
  value,
  initialInputList = EMPTY_ARRAY,
  isDisabled: disabled = false,
  borderType = 'success',
  inputClass = '',
  placeholder: customPlaceholder,
  type: customType,
  borderClass: customBorderClass,
  tabIndex = 0,
  min = 1,
  className = '',
  onChange,
  onKeydown,
  onFocus,
  onBlur,
  onIconClick,
}: InputProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [, setMaskValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const uniqueId = crypto.randomUUID();

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowInputBox(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const placeholder = useMemo(() => {
    if (customPlaceholder) return customPlaceholder;
    switch (inputName) {
      case 'email':
        return 'teste@exemplo.com';
      case 'password':
        return '******';
      default:
        return '';
    }
  }, [inputName, customPlaceholder]);

  const inputType = useMemo((): InputType => {
    if (customType) return customType;
    switch (inputName) {
      case 'email':
        return 'text';
      case 'password':
        return showPassword ? 'text' : 'password';
      case 'search':
      case 'phone':
      case 'cnpj':
      case 'postalCode':
      case 'only-numbers':
        return 'search';
      default:
        return 'text';
    }
  }, [inputName, customType, showPassword]);

  const borderClass = useMemo(() => {
    if (customBorderClass) return customBorderClass;
    switch (borderType) {
      case 'initial':
        return 'focus-within:border-gray-500 border-gray-500';
      case 'success':
        return 'focus-within:border-logo border-logo';
      case 'failure':
        return 'focus-within:border-red-400 border-red-400';
      default:
        return 'focus-within:border-logo border-logo';
    }
  }, [borderType, customBorderClass]);

  const inputListFiltered = useMemo(() => {
    if (initialInputList.length === 0) return [];
    if (inputValue) {
      return initialInputList
        .filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 5);
    }
    return initialInputList.slice(0, 5);
  }, [inputValue, initialInputList]);

  useEffect(() => {
    switch (inputName) {
      case 'phone':
        setMaskValue('(00) 0000-0000 ||(00) 00000-0000');
        break;
      case 'cnpj':
        setMaskValue('000.000.000-00 ||00.000.000/0000-00');
        break;
      case 'postalCode':
        setMaskValue('00000-000');
        break;
      case 'only-numbers':
        setMaskValue('separator.2');
        break;
      default:
        break;
    }
  }, [inputName]);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = (event.target as HTMLInputElement).value;
      setInputValue(newValue);
      setSelectedIndex(-1);
      onChange?.(newValue);
    },
    [onChange]
  );

  const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (inputListFiltered.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (selectedIndex >= inputListFiltered.length - 1) {
            setSelectedIndex(0);
          } else {
            setSelectedIndex((prev) => prev + 1);
          }
          setShowInputBox(true);
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (selectedIndex <= 0) {
            setSelectedIndex(inputListFiltered.length - 1);
          } else {
            setSelectedIndex((prev) => prev - 1);
          }
          setShowInputBox(true);
          break;
        case 'Enter':
          if (selectedIndex > -1 && showInputBox) {
            event.preventDefault();
            selectItem(selectedIndex);
          }
          break;
        case 'Escape':
          setShowInputBox(false);
          setSelectedIndex(-1);
          break;
      }
    }
    onKeydown?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (initialInputList.length > 0) {
      setShowInputBox(true);
    }
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    // setTimeout(() => {
    setShowInputBox(false);
    setSelectedIndex(-1);
    // }, 150);
    onBlur?.(event);
  };

  const selectItem = useCallback(
    (index: number) => {
      const selectedItem = inputListFiltered[index];
      setInputValue(selectedItem);
      setShowInputBox(false);
      setSelectedIndex(-1);
      onChange?.(selectedItem.trim());
    },
    [inputListFiltered, onChange]
  );

  const handleInputBoxItemClick = (
    event: MouseEvent<HTMLParagraphElement>,
    index: number
  ) => {
    event.stopPropagation();
    selectItem(index);
  };

  const handleIconClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (inputName === 'password') {
      setShowPassword(!showPassword);
    }

    onIconClick?.();
  };

  const icon = useMemo(() => {
    switch (inputName) {
      case 'email':
        return <FaEnvelope className="text-logo font-semibold" />;
      case 'password':
        return showPassword ? (
          <FaEyeSlash className="text-logo font-semibold" />
        ) : (
          <FaLock className="text-logo font-semibold" />
        );
      case 'search':
        return <FaSearch className="text-logo font-semibold" />;
      case 'phone':
        return <FaPhone className="text-logo font-semibold" />;
      case 'cnpj':
        return <FaBuilding className="text-logo font-semibold" />;
      case 'postalCode':
        return <FaMapMarkerAlt className="text-logo font-semibold" />;
      default:
        return null;
    }
  }, [inputName, showPassword]);

  const containerClasses = useMemo(
    () =>
      `${borderClass} ${
        showInputBox ? 'rounded-t-md border-t border-x' : 'rounded-md border'
      } flex w-full h-full focus-within:shadow-md`,
    [borderClass, showInputBox]
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={containerClasses}>
        <input
          ref={inputRef}
          id={id}
          type={inputType}
          disabled={disabled}
          placeholder={placeholder}
          min={min}
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeydown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`flex-1 bg-transparent w-full focus:outline-none pl-3 pr-1 py-1 disabled:bg-gray-100 disabled:text-gray-600 disabled:border-1 disabled:rounded-md placeholder:text-sm ${inputClass}`}
        />
        {icon && (
          <button
            onClick={handleIconClick}
            tabIndex={tabIndex}
            type="button"
            className="inline-flex items-center mr-1"
          >
            {icon}
          </button>
        )}
      </div>
      {showInputBox && (
        <div className="absolute w-full z-[200] top-[2rem] left-0 flex flex-col gap-1 border rounded-b border-gray-500 bg-white p-2">
          {inputListFiltered.length > 0 ? (
            inputListFiltered.map((item, index) => (
              <p
                key={index}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleInputBoxItemClick(
                      e as unknown as MouseEvent<HTMLParagraphElement>,
                      index
                    );
                  }
                }}
                onClick={(e) => handleInputBoxItemClick(e, index)}
                className={`px-2 rounded-sm cursor-pointer ${
                  selectedIndex === index ? 'bg-logo text-white' : ''
                }`}
              >
                {item}
              </p>
            ))
          ) : (
            <p className="italic">Não existem items a serem exibidos</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Input;
