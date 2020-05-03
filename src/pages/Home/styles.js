import styled from 'styled-components/native';

export const Image = styled.Image.attrs({
    resizeMode: 'cover',
})`
    height: 115px;
    width: 115px;
`;

export const ImageIconLocalization = styled.Image.attrs({
    resizeMode: 'contain',
})`
    height: 210px;
    width: 210px;
`;

export const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Button = styled.TouchableOpacity`
    height: 75px;
    width: 75px;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    border: ${props => (props.shouldHaveBorder ? '1px solid #f57c00' : 'none')};
`;

export const ButtonText = styled.Text`
    color: #f57c00;
    font-size: 11px;
`;

export const QRCodeReader = styled.View`
    flex: 2;
    align-items: center;
    justify-content: center;
`;

export const ButtonQrCode = styled.TouchableOpacity`
    height: 80%;
    width: 90%;
    margin: 10px 20px 0 20px;
    align-items: center;
    justify-content: center;
`;

export const ImageQrCode = styled.Image.attrs({
    resizeMode: 'cover',
})`
    height: 100%;
    width: 100%;
`;

export const TextQrCode = styled.Text`
    color: #9e9e9e;
    font-size: 15px;
    position: absolute;
`;
