
// import { HiOutlineChip, HiOutlineKey } from 'react-icons/hi'
import { MdMonitorHeart } from 'react-icons/md'
import { Link } from "react-router-dom";

const NavIcons = () => {
    return <span className="align-bottom">
        <Link to='/' className="inline-block text-2xl pl-3"><MdMonitorHeart /></Link>
        {/*
         <Link to='/elements' className="inline-block text-2xl pl-3"><HiOutlineChip /></Link>
        <Link to='/keys' className="inline-block text-2xl pl-3"><HiOutlineKey /></Link> 
        */}
    </span>
}

export default NavIcons