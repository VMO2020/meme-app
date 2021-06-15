import React from 'react';

// Components
import { Share } from './components/Share';
import { Meme } from './components/Meme';

// Styles
import './app.scss';

function App() {
	return (
		<div className='.general__container meme'>
			<div className='title'>
				<span>MEME Generator App</span>
			</div>
			{/* Share: Not use https: */}
			<Share url={'meme.vmog.net/'} />
			<hr />
			<Meme />
			<footer>
				<p>
					<a href='https://vmog.net/' target='_blank' rel='noreferrer'>
						Copyright and web design by © VMOG
					</a>
				</p>
				<p> Liverpool UK 2021 </p>
			</footer>
		</div>
	);
}

export default App;
