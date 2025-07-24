import Announcement from '../components/Announcement.js';
import AppNavBar from '../components/AppNavBar.js';
import Footer from '../components/Footer.js';
import Highlight from '../components/Highlight.js';
import Newsletter from '../components/Newsletter.js';

export default function Home() {

	return (
		<>
			<Announcement />
			<AppNavBar />
			<Highlight />
			<Newsletter />
			<Footer />
		</>
	)
}