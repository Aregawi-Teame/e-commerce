import React, {useState, useEffect} from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createProduct, getCategories } from "./apiAdmin";


const AddProduct = () =>{
    const {user, token} = isAuthenticated();
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    });

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData,
    } = values;

    // load categories and set form data
    const init = () =>{
        getCategories().then(data=>{
            if(data.error){
                setValues({...values, error: data.error});
            } else{
                setValues({...values, categories: data, formData: new FormData()});
            }
        });
    };
    useEffect(()=>{
        init();
    }, []);

    // This is higher order function which returns another function
    const handleChange = name => event =>{
        const value = name==='photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]:value});
    };

    const clickSubmit = event =>{
        event.preventDefault();
        setValues({...values, error: "", loading:true});
        
        createProduct(user._id, token, formData)
        .then(data=>{
            if(data.error){
                setValues({...values, error: data.error});
            }else{
                setValues({
                    ...values,
                    name: "",
                    description: "",
                    photo:"",
                    price:"",
                    quantity: "",
                    loading: false,
                    createdProduct: data.name
                });
            }
        })
    };
    const newPostForm = () =>(
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary"><input onChange={handleChange('photo')} type="file" name = "photo" accept="image/*" required/></label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} required/>
            </div>
            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} required/>
            </div>
            <div className="form-group">
                <label className="text-muted" for ="category">Category</label>
                <select id="category" onChange={handleChange('category')} className="form-control" required>
                    <option value="">Select...</option>
                    {categories && categories.map((c, i)=>(<option key={i} value={c._id}>{c.name}</option>))}
                </select>
            </div>
            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} required/>
            </div>
            <div className="form-group">
                <label className="text-muted" for ="shipping">Shipping</label>
                <select id="shipping" onChange={handleChange('shipping')} className="form-control" required>
                    <option value="">Select...</option>
                    <option value="0"> No</option>
                    <option value="1"> Yes</option>
                </select>
            </div>
            <div className="row">
                <div className="col-4">
                    <button className="btn btn-outline-primary">Create Product</button>
                </div>
                <div className="col-6">
                    <Link to="/admin/dashboard" className="btn btn-outline-warning">Back to Dashboard</Link>
                </div>
            </div>
        </form>
    );

    const showError = () =>(
        <div className="alert alert-danger" style={{display: error ? '':'none'}}>
            {error}
        </div>
    );
    const showSuccess = () =>(
        <div className="alert alert-info" style={{display: createdProduct ? '':'none'}}>
            <h2>{`${createdProduct}`} is created!</h2>
        </div>
    );
    const showLoading = () =>(
       loading && (<div className="alert alert-success">
           <h2>Loading...</h2>
       </div>)
    );
    return (
        <Layout title="Add a new product" description={`G'day ${user.name}, ready to add  new product?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                   {showLoading()}
                   {showSuccess()}
                   {showError()}
                   {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default AddProduct;