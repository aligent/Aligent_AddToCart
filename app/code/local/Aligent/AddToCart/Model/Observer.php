<?php

/**
 * Observer to intercept standard Magento add to cart and reply with JSON if add
 * to cart succeeded.
 */
class Aligent_AddToCart_Model_Observer {


    public function onAddToCart(Varien_Event_Observer $oObserver) {
        $oRequest = Mage::app()->getRequest();

        if ($oRequest->isAjax()) {
            $oProduct = $oObserver->getProduct();

            Mage::getSingleton('checkout/session')->setNoCartRedirect(true);
            $aResponseData = array(
                'productName' => $oProduct->getName(),
                'productQty' => $oProduct->getQty(),
                'productUrl' => $oProduct->getProductUrl(),
                'productImageUrl' => (string) Mage::helper('catalog/image')->init($oProduct, 'thumbnail', null, 'minicart_thumb'),
                'productFormattedPrice' => Mage::helper('core')->currency($oProduct->getFinalPrice(),true,false),
                'success' => 'true',
                'redirectTo' => false,
            );

            $oObserver->getResponse()->setBody(
                Mage::helper('core')->jsonEncode($aResponseData)
            );
        }
    }
}