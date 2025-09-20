import React, { useState } from 'react'
import { useCart } from '../CartContext'
import { cartStyles } from '../assets/dummyStyles';
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2, FiTag, FiX } from 'react-icons/fi';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
    
    // Coupon states
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [showCoupons, setShowCoupons] = useState(false);

    // Available coupons
    const coupons = [
        {
            id: 'SAVE10',
            title: 'SAVE10',
            description: '10% off on orders above ₹100',
            discount: 0.10,
            minAmount: 100,
            type: 'percentage'
        },
        {
            id: 'FLAT50',
            title: 'FLAT50',
            description: 'Flat ₹50 off on orders above ₹200',
            discount: 50,
            minAmount: 200,
            type: 'flat'
        },
        {
            id: 'MEGA15',
            title: 'MEGA15',
            description: '15% off on orders above ₹300',
            discount: 0.15,
            minAmount: 300,
            type: 'percentage'
        },
        {
            id: 'SUPER100',
            title: 'SUPER100',
            description: 'Flat ₹100 off on orders above ₹500',
            discount: 100,
            minAmount: 500,
            type: 'flat'
        }
    ];

    const handleQuantityChange = (itemId, change) => {
        const item = cart.find((i) => i.id === itemId)
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            updateQuantity(itemId, newQuantity)
        }
        else {
            removeFromCart(itemId)
        }
    }

    const applyCoupon = (coupon) => {
        const subtotal = getCartTotal();
        if (subtotal >= coupon.minAmount) {
            setSelectedCoupon(coupon);
            setShowCoupons(false);
        }
    };

    const removeCoupon = () => {
        setSelectedCoupon(null);
    };

    const calculateDiscount = () => {
        if (!selectedCoupon) return 0;
        
        const subtotal = getCartTotal();
        if (selectedCoupon.type === 'percentage') {
            return subtotal * selectedCoupon.discount;
        } else {
            return selectedCoupon.discount;
        }
    };

    const isCouponApplicable = (coupon) => {
        return getCartTotal() >= coupon.minAmount;
    };

    if (cart.length === 0) {
        return (
            <div className={cartStyles.pageContainer}>
                <div className={cartStyles.maxContainer}>
                    <Link to='/items' className={cartStyles.continueShopping}>
                        <FiArrowLeft className=' mr-2' />
                        Continue Shopping
                    </Link>

                    <div className={cartStyles.emptyCartContainer}>
                        <div className={cartStyles.emptyCartIcon}>🛒</div>
                        <h1 className={cartStyles.emptyCartHeading}>Your Cart is Empty</h1>
                        <p className={cartStyles.emptyCartText}>
                            Looks like you haven't added any organic goodies to your cart yet.
                        </p>
                        <Link to='/items' className={cartStyles.emptyCartButton}>
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const subtotal = getCartTotal();
    const discount = calculateDiscount();
    const taxes = (subtotal - discount) * 0.05;
    const total = subtotal - discount + taxes;

    return (
        <div className={cartStyles.pageContainer}>
            <div className={cartStyles.maxContainerLarge}>
                <div className={cartStyles.headerContainer}>
                    <h1 className={cartStyles.headerTitle}>
                        Your Shopping Cart
                    </h1>
                    <button onClick={clearCart} className={cartStyles.clearCartButton}>
                        <FiTrash2 className=' mr-1' />
                        Clear Cart
                    </button>
                </div>

                <div className={cartStyles.cartGrid}>
                    <div className={cartStyles.cartItemsSection}>
                        <div className={cartStyles.cartItemsGrid}>
                            {cart.map((item) => (
                                <div key={item.id} className={cartStyles.cartItemCard}>
                                    <div className={cartStyles.cartItemImageContainer}>
                                        <img src={item.image} alt={item.name} className={cartStyles.cartItemImage} />
                                    </div>
                                    <h3 className={cartStyles.cartItemName}>{item.name}</h3>
                                    <p className={cartStyles.cartItemPrice}>
                                        ₹{(item.price ?? 0).toFixed(2)}
                                    </p>

                                    {/* ADD CONTROLS */}
                                    <div className={cartStyles.cartItemQuantityContainer}>
                                        <button onClick={() => handleQuantityChange(item.id, -1)}
                                            className={cartStyles.cartItemQuantityButton}>
                                            <FiMinus />
                                        </button>
                                        <span className={cartStyles.cartItemQuantity}>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)}
                                            className={cartStyles.cartItemQuantityButton}>
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)}
                                        className={cartStyles.cartItemRemoveButton}>
                                        <FiTrash2 className=' mr-1' />
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className=' lg:col-span-1'>
                        <div className={cartStyles.orderSummaryCard}>
                            <h2 className={cartStyles.orderSummaryTitle}>Order Summary</h2>

                            <div className=' space-y-4 text-sm sm:text-base'>
                                <div className={cartStyles.orderSummaryRow}>
                                    <span className={cartStyles.orderSummaryLabel}>Subtotal</span>
                                    <span className={cartStyles.orderSummaryValue}>₹{subtotal.toFixed(2)}</span>
                                </div>

                                {/* COUPON SECTION */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-gray-700">Coupons & Offers</span>
                                        <button 
                                            onClick={() => setShowCoupons(!showCoupons)}
                                            className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                                        >
                                            <FiTag className="mr-1" />
                                            View Offers
                                        </button>
                                    </div>

                                    {/* Applied Coupon Display */}
                                    {selectedCoupon && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-green-800">{selectedCoupon.title}</div>
                                                    <div className="text-xs text-green-600">{selectedCoupon.description}</div>
                                                </div>
                                                <button 
                                                    onClick={removeCoupon}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Coupon List */}
                                    {showCoupons && (
                                        <div className="space-y-2 mb-4">
                                            {coupons.map((coupon) => (
                                                <div 
                                                    key={coupon.id} 
                                                    className={`border rounded-lg p-3 ${
                                                        isCouponApplicable(coupon) 
                                                            ? 'border-green-200 bg-green-50' 
                                                            : 'border-gray-200 bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-sm">{coupon.title}</div>
                                                            <div className="text-xs text-gray-600">{coupon.description}</div>
                                                            {!isCouponApplicable(coupon) && (
                                                                <div className="text-xs text-red-500 mt-1">
                                                                    Minimum order: ₹{coupon.minAmount}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button 
                                                            onClick={() => applyCoupon(coupon)}
                                                            disabled={!isCouponApplicable(coupon) || selectedCoupon?.id === coupon.id}
                                                            className={`px-3 py-1 text-xs rounded ${
                                                                isCouponApplicable(coupon) && selectedCoupon?.id !== coupon.id
                                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {selectedCoupon?.id === coupon.id ? 'Applied' : 'Apply'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Discount Row */}
                                {discount > 0 && (
                                    <div className={cartStyles.orderSummaryRow}>
                                        <span className={cartStyles.orderSummaryLabel}>Discount ({selectedCoupon?.title})</span>
                                        <span className="text-green-600 font-medium">-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className={cartStyles.orderSummaryRow}>
                                    <span className={cartStyles.orderSummaryLabel}>Shipping</span>
                                    <span className={cartStyles.orderSummaryValue}>Free</span>
                                </div>

                                <div className={cartStyles.orderSummaryRow}>
                                    <span className={cartStyles.orderSummaryLabel}>Taxes (5%)</span>
                                    <span className={cartStyles.orderSummaryValue}>₹{taxes.toFixed(2)}</span>
                                </div>

                                <div className={cartStyles.orderSummaryDivider}></div>

                                <div className={cartStyles.orderSummaryTotalRow}>
                                    <span className={cartStyles.orderSummaryTotalLabel}>Total</span>
                                    <span className={cartStyles.orderSummaryTotalValue}>₹{total.toFixed(2)}</span>
                                </div>

                                {/* Savings Display */}
                                {discount > 0 && (
                                    <div className="text-center">
                                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            You saved ₹{discount.toFixed(2)}! 🎉
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button className={cartStyles.checkoutButton}>
                                Proceed to Checkout
                            </button>

                            <div className={cartStyles.continueShoppingBottom}>
                                <Link to='/items' className={cartStyles.continueShopping}>
                                    <FiArrowLeft className=' mr-2' />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage