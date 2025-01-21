import React, { useEffect, useState } from "react";
//import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../stores";
import SearchInput from "../commonComponents/SearchInput";
import useDebouncedValue from "../../hooks/useDebouncedValue";

const NavBar = () => {
    const navigate = useNavigate();
    const { appStore } = useStore();
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebouncedValue(searchValue, 500)

    useEffect(()=>{
        appStore.setSearchValue(searchValue);
    },[debouncedSearchValue])

    return (
        <div className="p-3 bg-white">
            {/* Search Input */}
            <SearchInput haveSearchIcon={true} searchValue={searchValue} onChange={(e)=>setSearchValue(e.target.value)}/>
        </div>
    );
};

export default NavBar;
