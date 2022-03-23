import React, {useState, useEffect} from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./Radiobox";
import { prices } from "./fixedPrices";
const Shop = () =>{
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);

    const [myFilters, setMyFilters] = useState({
        filters: {
            category: [],
            price: []
        }
    });
    
    const init = () =>{
        getCategories().then(data=>{
            if(data.error){
                setError(data.error);
            } else{
                setCategories(data);
            }
        });
    };

    useEffect(()=>{
        init();
    }, []);

    const handleFilters = (filters, filterBy) =>{
        // console.log('SHOP', filters, filterBy)

        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;
        if(filterBy==="price"){
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        setMyFilters(newFilters);
};

const handlePrice = value =>{
    const data = prices;
    let array = [];
    for(let key in data){
        if(data[key]._id===parseInt(value))
            array = data[key].array;
    }
    return array;
};

    return (
        <Layout title="Shop Page" description="Search and find books of your choice" className="container-fluid">
           <div className="row">
                <div className="col-4">
                    <h2>Filter by categories</h2>
                    <ul>
                        <Checkbox categories={categories} handleFilters={filters =>handleFilters(filters, 'category')}/>
                    </ul>

                    <h2>Filter by price range</h2>
                    <div>
                        <RadioBox prices={prices} handleFilters={filters =>handleFilters(filters, 'price')}/>
                    </div>
                </div>
                <div className="col-4">
                    {JSON.stringify(myFilters)}
                </div>
           </div>
        </Layout> 
    );
};

export default Shop;