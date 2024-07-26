import { Link } from "react-router-dom";
import bottle from '../assets/bottle.png';

const Navbar = (websiteTheme: any) => {
  return (
    <div
    style={{
      backgroundColor: websiteTheme.bgColor,
      color: websiteTheme.textColor,
    }}
    className="hidden z-20 lg:flex items-center justify-between text-[14px] sm:text-[16px] lg:text-[18px] xl:text-[20px] mt-[30px] px-4 w-full"
  >
    <div className="flex items-center ml-[80px]">
    <Link to="/">
      <img src={bottle} alt="Logo" className="h-[17] w-[36px]" />
      </Link>
    </div>
    <div className="flex items-center gap-4 lg:gap-6 xl:gap-8">
      <Link to="/profile">
        <p>profile</p>
      </Link>
      <Link to="/">
        <p>exit</p>
      </Link>
    </div>
  </div>
  );
};

export default Navbar;
