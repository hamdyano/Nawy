import { Link } from "react-router-dom";
import { ApartmentType } from "../../../backend/src/shared/types";

type Props = {
  apartment: ApartmentType;
};

const LatestDestinationCard = ({ apartment }: Props) => {
  return (
    <Link
      to={`/detail/${apartment._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
      <div className="h-[300px]">
        <img
          src={apartment.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-3xl">
          {apartment.name}
        </span>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;