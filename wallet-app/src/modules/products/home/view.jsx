import { useEffect, useState } from "react";

import BalanceModal from "../../../components/modal/BalanceModal";
import PaymentModal from "../../../components/modal/PaymentModal";
import WalletModal from "../../../components/modal/WalletModal";
import { allProducts, buyProduct, confirmPurchase   } from "../../../services/product";
import { useAuthStore } from "../../../store";
import { balanceUser, rechargeWallet } from "../../../services/user";
import { STATE_WALLET } from "../../../constants";

const ProductsHomeView = () => {
  const [products, setProducts] = useState([]);
  const [balance, setBalance] = useState(null);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState({
    open: false,
    product_id: null,
  });

  const { user } = useAuthStore();

  const getBalanceUser = async (document, phone) => {
    try {
      const { data, message } = await balanceUser({ document, phone });
      setBalance(data.balance);
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getRechargeWallet = async (document, phone, value) => {
    try {
      const { data, message } = await rechargeWallet({ document, phone, value });
      if (balance && data.value) setBalance(data.value);
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getBuyProduct = async (product_id) => {
    try {
      const wallet_id = user?.wallets[0]?.id;
      const { message } = await buyProduct({ user_id: user.id, wallet_id, product_id });
      getAll();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    } 
  };

  const getConfirmPurchase = async (idSession, token, product_id) => {
    try {
      const wallet_id = user?.wallets[0]?.id;
      const { message } = await confirmPurchase({ idSession, token, user_id: user.id, wallet_id, product_id });
      getAll();
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getAll = async () => {
    try {
      const data = await allProducts();
      const newData = await data.map(product => {
        const userFilter = product?.buys?.filter(buy => buy?.user?.id === user.id && buy?.state === STATE_WALLET.PENDING)
        product.isConfirm = userFilter.length ? true : false;
        return product;
      });
      setProducts(newData);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex justify-end mt-4 space-x-2">
          <div className="p-4 w-60 duration-200">
            <button
              onClick={() => setIsBalanceModalOpen(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
            >
              Solicitar Saldo {balance}
            </button>
          </div>
          <div className="p-4 w-60 duration-200">
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
            >
              Recargar Billetera
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {
          products.length && products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-60 hover:shadow-lg transition-shadow duration-200">
              <img src={product.urlImage} alt={product.name} className="w-full h-32 object-cover rounded-md" />
              <div className="mt-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-700">Precio: ${product.price}</p>
                <p className="text-gray-500">Cantidad: {product.quantity}</p>
                {
                  product.isConfirm ? (
                    <button
                      className="mt-3 w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition-colors duration-200"
                      onClick={() => setIsPaymentModalOpen((prev) => ({ ...prev, open: true, product_id: product.id}))}
                    >
                      Confirmar Compra
                    </button>
                  ) : (
                    <button
                      className="mt-3 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-200"
                      onClick={() => getBuyProduct(product.id)}
                    >
                      Comprar
                    </button>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
      <BalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        onSubmit={getBalanceUser}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSubmit={getRechargeWallet}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen((prev) => ({ ...prev, open: false }))}
        onSubmit={getConfirmPurchase}
      />
    </div>
  );
};

export default ProductsHomeView;
