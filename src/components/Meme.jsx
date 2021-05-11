import React, { useState, useEffect, useRef } from 'react';

// Icons
import { ReactComponent as Icon1 } from '../icons/image.svg';
import { ReactComponent as Icon2 } from '../icons/delete.svg';

// Styles
import './meme.scss';

export const Meme = () => {
	const [image, setImage] = useState(null);
	const canvas = useRef(null);
	const [topText, setTopText] = useState('');
	const [bottomText, setBottomText] = useState('');

	const [backColor, setBackColor] = useState('#222831');
	const [textColor, setTextColor] = useState('#F7F7F7');
	const [fontSize, setFontSize] = useState(24);
	const [fontFamily, setFontFamily] = useState('Comic Sans MS');

	const [previewIMG, setPreviewIMG] = useState();
	const [heightValue, setHeightValue] = useState(1080); // height in px
	const [scaleFactor, setScaleFactor] = useState(1); // Aspect Ratio
	// const [imageURL, setImageURL] = useState('');

	const widthValue = 1080; // width in px

	const reset = () => {
		setHeightValue(600);
	};

	const handleBackChange = (e) => {
		setBackColor(e.target.value);
	};

	const handleTextChange = (e) => {
		setTextColor(e.target.value);
	};

	const getCanvasIMG = () => {
		let canvas = document.getElementById('canvas');
		let dataURL = canvas.toDataURL();

		document.querySelector('#download').href = dataURL;
		document.querySelector('#hidden').classList.remove('hidden');

		setTimeout(() => {
			document.querySelector('#hidden').classList.add('hidden');
		}, 5000);
	};

	const handleInputChange = (e) => {
		const reset = '';
		setPreviewIMG(reset);

		//get the image selected
		const item = e.target.files[0];

		if (item) {
			// Get the image selected mobile friendly
			setPreviewIMG(URL.createObjectURL(e.target.files[0]));

			//create a FileReader
			const reader = new FileReader();

			//image turned to base64-encoded Data URI.
			reader.readAsDataURL(item);
			reader.name = item.name; //get the image  name
			reader.size = item.size; //get the image size
			reader.type = item.type; //get the image type
		} else {
			console.log('Image not selected');
		}
	};

	useEffect(() => {
		const newImage = new Image();
		newImage.src = previewIMG;
		newImage.onload = (e) => {
			setImage(newImage);
			setScaleFactor(widthValue / e.target.width);
			setHeightValue(e.target.height * scaleFactor);
		};
	}, [previewIMG, scaleFactor, setHeightValue]);

	useEffect(() => {
		if (image && canvas) {
			const ctx = canvas.current.getContext('2d');

			ctx.fillStyle = backColor;

			// Canvas container
			ctx.fillRect(0, 0, widthValue, heightValue);

			// draw image in canvas
			ctx.drawImage(
				image,
				fontSize * 2,
				fontSize * 2,
				widthValue - fontSize * 4,
				heightValue - fontSize * 4
			);

			// Font
			ctx.font = `${fontSize}px ${fontFamily}`;
			ctx.fillStyle = textColor;
			ctx.textAlign = 'center';

			// Text position
			ctx.fillText(topText, widthValue / 2, fontSize);
			ctx.fillText(bottomText, widthValue / 2, heightValue - (fontSize - 7));
		}
	}, [
		image,
		canvas,
		topText,
		bottomText,
		previewIMG,
		textColor,
		backColor,
		heightValue,
		fontSize,
		fontFamily,
	]);

	return (
		<section className='meme-container'>
			<h1>Your Meme!</h1>

			<form>
				<fieldset>
					<legend> Settings </legend>

					<div className='text-container'>
						<label>
							1. Background Color:
							<input
								className='text'
								type='color'
								value={backColor}
								onChange={handleBackChange}
							></input>
						</label>
						<label>
							2. Text Color:
							<input
								className='text'
								type='color'
								value={textColor}
								onChange={handleTextChange}
							></input>
						</label>
					</div>

					<div className='text-container'>
						<div>
							<label>3. Top Text: </label>
							<input
								type='text'
								className='text'
								value={topText}
								placeholder='Your Top text'
								size='32'
								onChange={(e) => setTopText(e.target.value)}
							/>
						</div>
						<div>
							<label>4. Bottom Text: </label>
							<input
								type='text'
								className='text'
								value={bottomText}
								placeholder='Your Bottom text'
								size='29'
								onChange={(e) => setBottomText(e.target.value)}
							/>
						</div>
					</div>

					<div className='text-container'>
						<div className='font-selectors'>
							<label>5. Font Size: </label>
							<select onChange={(e) => setFontSize(e.target.value)}>
								<option value='24'>Select:</option>
								<option value='24'>24px</option>
								<option value='32'>32px</option>
								<option value='40'>40px</option>
								<option value='50'>50px</option>
								<option value='60'>60px</option>
								<option value='80'>80px</option>
								<option value='100'>100px</option>
							</select>
						</div>
						<div>
							<label>6. Font Family: </label>
							<select onChange={(e) => setFontFamily(e.target.value)}>
								<option value='Comic Sans MS'>Select:</option>
								<option value='Arial'>Arial</option>
								<option value='Comic Sans MS'>Comic Sans MS</option>
								<option value='Courier'>Courier</option>
								<option value='Courier New'>Courier New</option>
								<option value='cursive'>cursive</option>
								<option value='Didot'>Didot</option>
								<option value='Helvetica'>Helvetica</option>
								<option value='Tahoma'>Tahoma</option>
								<option value='Monaco'>Monaco</option>
								<option value='monospace'>monospace</option>
								<option value='Optima'>Optima</option>
								<option value='Ranchers'>Ranchers</option>
								<option value='Times New Roman'>Times New Roman</option>
								<option value='Verdana'>Verdana</option>
							</select>
						</div>
					</div>

					<div className='text-container'>
						<button className='btn-click reset' onClick={reset}>
							<Icon2 />
							<span>Reset form</span>
						</button>
					</div>
				</fieldset>
			</form>

			<input
				id='uploader'
				type='file'
				accept='.jpeg, .jpg, .png'
				onChange={handleInputChange}
			/>

			<div className='label-container'>
				<label htmlFor='uploader' className='btn-click'>
					<Icon1 />
					<span>Choose a Image</span>
				</label>
			</div>
			<hr />

			<div className='canvas-container'>
				<canvas
					id='canvas'
					ref={canvas}
					width={widthValue}
					height={heightValue}
				/>
			</div>

			<div id='button-container'>
				{previewIMG && (
					<>
						<span className='btn-click' onClick={getCanvasIMG}>
							PROCESS: Meme to PNG
						</span>
						<div className='hidden' id='hidden'>
							<a
								href={document.getElementById('canvas')}
								download='myMeme'
								id='download'
								className='btn-click'
							>
								Download
							</a>
						</div>
					</>
				)}
			</div>
		</section>
	);
};
