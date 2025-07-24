import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components'

const Container = styled.div`
  height: 60vh;
  background-color: #fcf5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 20px;

  @media screen and (max-width: 768px) {
    font-size: 40px;
  }
`;

const Desc = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20;
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const InputContainer = styled.div`
  width: 50%;
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;

  @media screen and (max-width: 768px) {
    width: 80%;
  }
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Button = styled.button`
  flex: 1;
  border: none;
  background-color: teal;
  color: white;

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Newsletter = () => {
  return (
    <Container>
      <Title>Newsletter</Title>
      <Desc>Get our latest updates for your favorite gaming peripherals.</Desc>
      <InputContainer>
        <Input placeholder="Enter your email address" />
        <Button>
          <SendIcon />
        </Button>
      </InputContainer>
    </Container>
  )
}

export default Newsletter