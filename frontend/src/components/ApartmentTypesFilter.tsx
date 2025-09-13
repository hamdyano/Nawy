import { apartmentTypes } from "../config/apartment-options-config";

type Props = {
  selectedApartmentTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ApartmentTypesFilter = ({ selectedApartmentTypes, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Apartment Type</h4>
      {apartmentTypes.map((apartmentType) => (
        <label key={apartmentType} className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded"
            value={apartmentType}
            checked={selectedApartmentTypes.includes(apartmentType)}
            onChange={onChange}
          />
          <span>{apartmentType}</span>
        </label>
      ))}
    </div>
  );
};

export default ApartmentTypesFilter;