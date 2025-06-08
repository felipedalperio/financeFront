import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import { Fragment } from 'react';
import { IconeTipo } from '../utils/Util';

const tipos = [
  { id: 'RECEITA', nome: 'Receita' },
  { id: 'DESPESA', nome: 'Despesa' },
];

export default function TipoListbox({ value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative mt-1">
          <ListboxButton className="w-full p-2 border rounded flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
              {value && IconeTipo(value, 20)}
              <span>{tipos.find((t) => t.id === value)?.nome || 'Selecione'}</span>
            </div>
            <FaChevronDown className="text-gray-400" />
          </ListboxButton>

          {open && (
            <ListboxOptions className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded bg-white shadow border border-gray-300">
              {tipos.map((tipo) => (
                <ListboxOption key={tipo.id} value={tipo.id} as={Fragment}>
                  {({ active, selected }) => (
                    <li
                      className={`flex gap-2 cursor-pointer select-none p-2 list-none ${
                        active ? 'bg-blue-100' : ''
                      } ${selected ? 'font-medium' : ''}`}
                    >
                      {IconeTipo(tipo.id, 20)}
                      {tipo.nome}
                    </li>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          )}
        </div>
      )}
    </Listbox>
  );
}
