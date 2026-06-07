import Announcement from '../components/Announcement';
import AppNavBar from '../components/AppNavBar';
import Footer from '../components/Footer';
import Highlight from '../components/Highlight';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <>
      <Announcement />
      <AppNavBar />
      <Highlight />
      <Newsletter />
      <Footer />
    </>
  );
}
