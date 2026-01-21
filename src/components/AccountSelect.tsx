import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  accountId: string;
}

interface AccountSelectProps {
  accounts: Account[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const AccountSelect: React.FC<AccountSelectProps> = ({
  accounts,
  value,
  onChange,
  placeholder = '选择广告账户',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedAccount = accounts.find(a => a.id === value);

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => {
    const searchLower = searchTerm.toLowerCase();
    return (
      account.name.toLowerCase().includes(searchLower) ||
      account.accountId.toLowerCase().includes(searchLower)
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset search term when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full cursor-pointer rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${
          !value ? 'text-slate-500' : 'text-slate-900'
        }`}
      >
        <span className="block truncate">
          {selectedAccount ? `${selectedAccount.name} ${selectedAccount.accountId ? `(${selectedAccount.accountId})` : ''}` : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {/* Search Input */}
          <div className="sticky top-0 z-10 bg-white px-2 py-2 border-b border-slate-100">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="搜索账户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <ul className="max-h-48 overflow-auto py-1">
            {filteredAccounts.length === 0 ? (
              <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-slate-500 italic text-center">
                未找到匹配账户
              </li>
            ) : (
              filteredAccounts.map((account) => (
                <li
                  key={account.id}
                  className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50 ${
                    value === account.id ? 'bg-blue-50 text-blue-900' : 'text-slate-900'
                  }`}
                  onClick={() => {
                    onChange(account.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className={`block truncate ${value === account.id ? 'font-medium' : 'font-normal'}`}>
                      {account.name}
                    </span>
                    {account.accountId && (
                      <span className="text-xs text-slate-500 truncate">
                        ID: {account.accountId}
                      </span>
                    )}
                  </div>

                  {value === account.id && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountSelect;
