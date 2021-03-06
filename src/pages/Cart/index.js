import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RadioButton} from 'react-native-paper';
import {ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';

import qrCodeIcon from '../../assets/icons/QRCode/iconQRCodeSmallPNG.png';
import btnPay from '../../assets/icons/payment/iconPaymentSmallPNG.png';

import Product from '../../components/Product';
import NewAddressForm from '../../components/NewAddressForm';

import {formatPrice} from '../../utils/format';
import * as CartActions from '../../store/modules/Cart/actions';

import Layout from '../Layout';

import {
    Row,
    Image,
    Text,
    AddressView,
    AddressButtonsView,
    AddressButton,
    CurrentAddressView,
    Address,
    Select,
    ChangeAddressView,
    Button,
    ProductsList,
    BottomView,
    BottomText,
    CEPInput,
    ChangeAddress,
} from './styles';

export default function Cart({navigation}) {
    const [activeButton, setActiveButton] = useState('addressesList');
    const [changeAddress, setChangeAddress] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [cep, setCep] = useState('');
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();
    const addresses = useSelector(state => state.Address);
    const products = useSelector(state =>
        state.Cart?.map(product => ({
            ...product,
            subtotal: product.price * product.amount,
        })),
    );

    useEffect(() => {
        if (auth().currentUser == null) {
            navigation.popToTop();
        }
    });

    useEffect(() => {
        if (addresses != null) {
            setCurrentAddress(addresses[0]);
        }
        setActiveButton('addressesList');
        setChangeAddress(false);
    }, [addresses]);

    useEffect(() => {
        setTotal(calculateTotal());
    }, [calculateTotal, products]);

    const calculateTotal = useCallback(() => {
        let subtotal = 0;
        products.forEach(p => {
            subtotal += p.subtotal;
        });
        return subtotal;
    }, [products]);

    function handlePaymentButton() {
        dispatch(CartActions.confirmPayment());
        navigation.navigate('LoadPaymentScreen', {
            address: currentAddress,
            products: products,
        });
    }

    function handleAdressButton(active) {
        setActiveButton(active);
    }

    const handleBackButton = () => {
        navigation.navigate('HomeScreen');
    };

    const handleQRCodeButton = () => {
        navigation.navigate('HomeScreen');
    };

    function YourAddresses() {
        if (changeAddress) {
            if (addresses == null) {
                return (
                    <Text color="#000" weight="bold" size="10px">
                        Nenhum endereço cadastrado
                    </Text>
                );
            }
            return (
                <ChangeAddressView
                    data={addresses}
                    keyExtractor={item => item.street}
                    renderItem={({item}) => (
                        <Select>
                            <RadioButton
                                value="first"
                                status={
                                    item.key === currentAddress.key
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                onPress={() => {
                                    setCurrentAddress(item);
                                    setChangeAddress(false);
                                }}
                            />
                            <Address>
                                <Text color="#000" weight="bold" size="10px">
                                    {item.county}
                                </Text>
                                <Text color="#000" size="10px">
                                    {item.zipCode}
                                </Text>
                                <Text color="#000" size="10px">
                                    {item.street}, {item.number}
                                </Text>
                            </Address>
                        </Select>
                    )}
                />
            );
        } else {
            return (
                <CurrentAddressView>
                    {currentAddress == null ? (
                        <Address width="100%">
                            <Text color="#000" size="10px">
                                Cadastre um endereço
                            </Text>
                        </Address>
                    ) : (
                        <>
                            <Address width="70%">
                                <Text color="#000" size="10px">
                                    {currentAddress.county}
                                </Text>
                                <Text color="#000" weight="bold">
                                    CEP {currentAddress.zipCode}
                                </Text>
                                <Text color="#000" size="10px">
                                    {currentAddress.street},{' '}
                                    {currentAddress.number}
                                </Text>
                            </Address>
                            <ChangeAddress
                                onPress={() => setChangeAddress(true)}>
                                <Text color="#f57c00">TROCAR</Text>
                            </ChangeAddress>
                        </>
                    )}
                </CurrentAddressView>
            );
        }
    }

    return (
        <Layout arrowBack={handleBackButton}>
            <AddressView>
                <AddressButtonsView>
                    <AddressButton
                        bgColor={
                            activeButton === 'addressesList'
                                ? '#f57c00'
                                : '#fff'
                        }
                        onPress={() => handleAdressButton('addressesList')}>
                        <Text
                            color={
                                activeButton == 'addressesList'
                                    ? '#fff'
                                    : '#f57c00'
                            }>
                            Seus endereços
                        </Text>
                    </AddressButton>
                    <AddressButton
                        bgColor={
                            activeButton === 'addressesList'
                                ? '#fff'
                                : '#f57c00'
                        }
                        onPress={() => handleAdressButton('newAddress')}>
                        <Text
                            color={
                                activeButton == 'addressesList'
                                    ? '#f57c00'
                                    : '#fff'
                            }>
                            Novo endereço
                        </Text>
                    </AddressButton>
                </AddressButtonsView>
                {activeButton === 'addressesList' && YourAddresses()}
                {activeButton === 'newAddress' && (
                    <CEPInput
                        type={'zip-code'}
                        value={cep}
                        onChangeText={setCep}
                        placeholder="digite o novo CEP de entrega"
                    />
                )}
            </AddressView>
            <ScrollView showsVerticalScrollIndicator={false}>
                {activeButton === 'addressesList' ? (
                    <>
                        <ProductsList
                            data={products}
                            keyExtractor={item => item.code}
                            renderItem={({item}) => (
                                <Product
                                    product={item}
                                    navigation={navigation}
                                />
                            )}
                        />
                        <BottomView>
                            {products.length !== 0 ? (
                                <BottomText>
                                    Sua compra será no valor de{' '}
                                    {formatPrice(total)} a vista, ou em até 12x
                                    de {formatPrice(total / 12)} s/ juros no
                                    cartão de crédito. Pague com o Ame Digital e
                                    receba de volta {formatPrice(total / 50)}
                                    <BottomText color="orange">
                                        {' '}
                                        (2%)
                                    </BottomText>
                                </BottomText>
                            ) : (
                                <BottomText>
                                    A sua sacola está vazia,
                                    <BottomText color="orange">
                                        {' '}
                                        tente escanear um de nossos produtos !
                                    </BottomText>
                                </BottomText>
                            )}
                        </BottomView>
                    </>
                ) : (
                    <NewAddressForm cep={cep} />
                )}
                <Row>
                    <Button onPress={() => handleQRCodeButton(navigation)}>
                        <Image source={qrCodeIcon} />
                    </Button>
                    {products.length !== 0 && (
                        <Button onPress={() => handlePaymentButton(navigation)}>
                            <Image source={btnPay} />
                        </Button>
                    )}
                </Row>
            </ScrollView>
        </Layout>
    );
}
