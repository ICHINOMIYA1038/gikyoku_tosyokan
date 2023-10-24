import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Pagination = ({ star = 0,rateCount=0}: any) => {


    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <span key={value}>
                <FontAwesomeIcon
                  icon={faStar}
                  className={value <= star ? "text-yellow-500" : "text-gray-300"}
                />
              </span>
            ))}
            <p className="ml-1">({rateCount})</p>
        </div>
    );
  };
  
  export default Pagination;
  