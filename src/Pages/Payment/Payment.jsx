import React, { useContext, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import classes from "./payment.module.css";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { FiLoader } from "react-icons/fi";
import { db } from "../../Utility/Firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/Action.type";

const Payment = () => {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // total item
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);

  // total amount
  const total = basket?.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);

      // Backend contact to get client secret
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });
      // console.log(response.data);
      const clientSecret = response.data?.clientSecret;

      // Client-side payment confirmation
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user?.email,
          },
        },
      });

      // Save order in Firebase
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });
      // empty the basket
      dispatch({
        type: Type.EMPTY_BASKET,
      });
      setProcessing(false);
      navigate("/orders", { state: { msg: "You have placed new Order" } });
    } catch (error) {
      console.log(error);
      setCardError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      {/* header */}
      <div className={classes.payment_header}>Checkout {totalItem} items</div>

      {/* payment method */}
      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>Bole sub city</div>
            <div>Addis Ababa, Ethiopia</div>
          </div>
        </div>
        <hr />

        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard product={item} flex={true} key={item.id} />
            ))}
          </div>
        </div>

        <hr />
        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment Methods</h3>
          <div className={classes.payment_card_container}>
            <div className={classes.payment_details}>
              <form onSubmit={handlePayment}>
                {/* error */}
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}
                {/* card element */}
                <CardElement onChange={handleChange} />
                {/* price */}
                <div>
                  <div className={classes.payment_price}>
                    <span>
                      Total Order | <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit" disabled={processing}>
                    {processing ? (
                      <div className={classes.loading}>
                        <FiLoader color="gray" size={12} />
                        <p>Please Wait...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
};

export default Payment;
