import React, {useState, useEffect} from "react";
import Layout from "./Layout";
import { getProducts, getBrainTreeClientToken, processPayment, createOrder } from "./apiCore";
import { emptyCart } from "./cartHelpers";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import Dropln from "braintree-web-drop-in-react";

const Checkout = ({products, setRun = f=>f, run=undefined}) =>{
    const [data, setData] = useState({
       loading: false,
       success: false,
       clientToken: null,
       error: '',
       instance: {},
       address: ''
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) =>{
        getBrainTreeClientToken(userId, token).then(data=>{
            if(data.error){
                setData({...data, error: data.error});
            } else{
                setData({clientToken: data.clientToken});
            }
        });
    };

    useEffect(()=>{
        getToken(userId, token);
    }, []);


    const showCheckout = () =>{
        return (
            isAuthenticated()? (
                <div>{showDropIn()}</div>
            ) : (
                <Link to="/signin">
                    <button className ="btn btn-primary">Sign in to checkout</button>
                </Link>
            )
        );
    };

    const buy = () => {
        setData({loading: true});
        // send the nonce to server
        // nonce = data.instance.requestPaymentMethod
        let nonce;
        let getNonce = data.instance.requestPaymentMethod().then(data=>{
            // console.log(data);
            nonce = data.nonce;
            // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce
            // and also total to be charged
            // console.log(`send nonce and total to process: ${nonce}, ${getTotal(products)}`)
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getTotal(products)
            };

            processPayment(userId, token, paymentData).then(response=>{
               //console.log(response)
               setData({...data, success: response.success});
               // create order
               const createOrderData = {
                   products: products,
                   transaction_id: response.transaction.id,
                   amount: response.transaction.amount,
                   address: data.address
               }
               createOrder(userId, token, createOrderData)
               // empty cart
               setRun(!run);// run useEffect in parent Cart
               emptyCart(()=>{
                    console.log("payment success and empty cart");
                    setData({loading: false});
               });
            })
            .catch(error=>{
                console.log(error);
                setData({loading: false});
            });
        }).catch(error =>{
            // console.log('dropin error:', error);
            setData({...data, error: error.message});
        });

    };

    const showLoading = (loading)=>(
        loading && <h2>Loading...</h2>
    );
    const handleAddress = event=>{
        setData({...data, address:event.target.value})
    }

    const showDropIn = () =>(
        <div onBlur={()=>setData({...data, error: ""})}>
            {data.clientToken!==null && products.length > 0 ? (
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea onChange={handleAddress} className="form-control" value={data.address} placeholder="Type your delivery address here..."/>
                    </div>
                    <Dropln options={{
                        authorization: data.clientToken,
                        paypal:{
                            flow: 'vault'
                        }
                    }} onInstance={instance=>(data.instance=instance)}/>
                    <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                </div>
            ) : null}
        </div>
    );

    const getTotal = () =>{
        return products.reduce((currentValue, product)=>{
            return currentValue + product.count * product.price;
        },0);
    };
    const showError = error =>(
        <div className="alert alert-danger" style={{display: error ? '' : "none"}}>
            {error}    
        </div>
    );
    const showSuccess = success =>(
        <div className="alert alert-inso" style={{display: success ? '' : "none"}}>
            Thanks! Your payment was successful!    
        </div>
    );
    return <div>
        <h2>Total: ${getTotal()}</h2>
        {showLoading(data.loading)}
        {showSuccess(data.success)}
        {showError(data.error)}
        {showCheckout()}
    </div>
};

export default Checkout;