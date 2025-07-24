import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import React from 'react'
import { useState, useContext } from 'react';
import styled from 'styled-components'
import { sliderItems } from '../data';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../UserContext';

const Container = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	position: relative;
	overflow: hidden;
`;

const Arrow = styled.div`
	width: 50px;
	height: 50px;
	background-color: lightgray;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	bottom: 0;
	left:${props => props.direction === "left" && "10px"};
	right:${props => props.direction === "right" && "10px"};
	margin: auto;
	cursor: pointer;
	opacity: 0.5;
	z-index: 2;
`;

const Wrapper = styled.div`
	height: 100%;
	display: flex;
	transition: all 1.5s ease;
	transform: translateX(${props => props.slideIndex * -100}vw);
`;

const Slide = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	background-color: ${props => props.bg};
`;

const Image = styled.img`
	height: 80%;
	width: 100%;
	object-fit: cover;
`

const ImgContainer = styled.div`
	height: 100%;
	flex: 1;
	display: flex;

	@media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const InfoContainer = styled.div`
	flex: 1;
	padding: 50px;

	@media screen and (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

const Title = styled.h1`
	font-size: 70px;

	@media screen and (max-width: 768px) {
    font-size: 40px;
  }
`;
const Description = styled.p`
	margin: 50px 0px;
	font-size: 20px;
	font-weight: 500;
	letter-spacing: 3px;

	@media screen and (max-width: 768px) {
    font-size: 16px;
    margin: 20px 0px;
  }
`;


const Button = styled.button`
	padding: 10px;
	font-size: 20px;
	background-color: transparent;

	@media screen and (max-width: 768px) {
    font-size: 16px;
    padding: 5px;
  }
`;

const Highlight = () => {
	const [slideIndex, setSlideIndex] = useState(0);
	const handleClick = (direction) => {

		if (direction === "left") {
			setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2)
		} else {
			setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0)
		}
	};

	const { user } = useContext(UserContext);

	return (
		<Container>
			<Arrow direction="left" onClick={() => handleClick("left")}>
				<ArrowLeftOutlinedIcon />
			</Arrow>
			<Wrapper slideIndex={slideIndex}>
				{sliderItems.map((item) => (
					<Slide bg={item.bg} key={item.id}>
						<ImgContainer>
							<Image src={item.img} />
						</ImgContainer>
						<InfoContainer>
							<Title>{item.title}</Title>
							<Description>{item.desc}</Description>
							{user.isAdmin ? (
								<Navigate to="/" />
							) : (
								<Button as={Link} to="/products" className="text-decoration-none border border-black" style={{ color: 'black' }}>
									SHOP NOW!
								</Button>
							)}
						</InfoContainer>
					</Slide>
				))}
			</Wrapper>
			<Arrow direction="right" onClick={() => handleClick("right")}>
				<ArrowRightOutlinedIcon />
			</Arrow>
		</Container>
	)
}

export default Highlight