import styled from "styled-components"

const Container = styled.div`
  height: 30px;
  background-color: darkblue;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
`;

const Announcement = () => {
  return (
    <Container>
      Great Deal! Free Shipping on Orders over ₱1,500
    </Container>
  )
}

export default Announcement