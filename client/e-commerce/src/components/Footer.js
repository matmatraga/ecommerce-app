import { Facebook, Instagram, MailOutline, Phone, Room, Twitter } from "@mui/icons-material";
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Logo = styled.h1``

const Desc = styled.p`
  margin: 20px 0px;
`;

const SocialContainer = styled.div`
  display: flex;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  background-color: #${props => props.color}
`;

const Center = styled.div`
  flex: 1;
  padding: 20px;
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  width: 50%;
  margin-bottom: 10px;
`;

const Right = styled.div`
  flex: 1;
  padding: 20px;
`;

const ContactItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Payment = styled.img`
  width: 30%;
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Logo>ASTER.</Logo>
        <Desc>Variety of gaming peripherals that will improve your gaming experience with good quality, fast delivery and discounted prices.</Desc>
        <SocialContainer>
          <SocialIcon color="385999">
            <Facebook />
          </SocialIcon>
          <SocialIcon color="E4405F">
            <Instagram />
          </SocialIcon>
          <SocialIcon color="55ACEE">
            <Twitter />
          </SocialIcon>
        </SocialContainer>
      </Left>
      <Center>
        <Title >Useful Links</Title>
        <List>
          <ListItem>Home</ListItem>
          <ListItem>Products</ListItem>
          <ListItem>About</ListItem>
          <ListItem>Contact</ListItem>
          <ListItem>Terms of Use</ListItem>
        </List>
      </Center>
      <Right>
        <Title>Contact</Title>
        <ContactItem>
          <Room style={{ marginRight: "10px" }} />Sta. Rosa, Laguna, Philippines 4026
        </ContactItem>
        <ContactItem>
          <Phone style={{ marginRight: "10px" }} />+63 9123456781
        </ContactItem>
        <ContactItem>
          <MailOutline style={{ marginRight: "10px" }} />contact@aster.dev
        </ContactItem>
        <Payment src="https://i.ibb.co/Qfvn4z6/payment.png" />
      </Right>
    </Container>
  )
}

export default Footer