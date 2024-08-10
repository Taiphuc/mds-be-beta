import { Star, StarSolid } from "@medusajs/icons";
import { FC } from "react";
type RatingStarProps = { rate: number };
const RatingStar: FC<RatingStarProps> = ({ rate }) => {
  const map = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {map?.map((e, i) => {
        return e > rate ? <Star key={i} /> : <StarSolid style={{ color: "#FEA433" }} key={i} />;
      })}
    </div>
  );
};
export default RatingStar;
