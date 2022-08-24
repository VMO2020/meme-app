import React, { useState, useEffect, useRef } from 'react';

// Icons
import { ReactComponent as Icon1 } from '../assets/icons/image.svg';
import { ReactComponent as Icon2 } from '../assets/icons/delete.svg';

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
	const [margin, setMargin] = useState(true);
	const [fontFamily, setFontFamily] = useState('Comic Sans MS');

	const [previewIMG, setPreviewIMG] = useState();
	const [maxValue, setMaxValue] = useState(1024); // max width or height in px
	const [widthValue, setWidthValue] = useState(1024); // width in px
	const [heightValue, setHeightValue] = useState(768); // height in px
	const [quality, setQuality] = useState(1); // Image quality (0.2 to 1)
	const [imageSize, setImageSize] = useState(1); // Image size KB

	// const [imageURL, setImageURL] = useState('');

	const reset = () => {
		setWidthValue(1024);
		setHeightValue(768);
	};

	const handleBackChange = (e) => {
		setBackColor(e.target.value);
	};

	const handleTextChange = (e) => {
		setTextColor(e.target.value);
	};

	const handleImageQuality = (e) => {
		setQuality(e.target.value);
	};
	const handleMargin = () => {
		setMargin(!margin);
	};

	const handleImageSize = () => {
		let width = widthValue;
		let height = heightValue;

		if (width > height) {
			if (width > maxValue) {
				height *= maxValue / width;
				width = maxValue;
			}
		} else {
			if (height > maxValue) {
				width *= maxValue / height;
				height = maxValue;
			}
		}
		setWidthValue(width);
		setHeightValue(height);
	};

	const handleInputChange = (e) => {
		const reset = '';
		setPreviewIMG(reset);
		handleImageSize();

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

	// PROCESS: Meme to JPEG
	const getCanvasIMG = () => {
		handleImageSize();

		let canvas = document.getElementById('canvas');

		// Image PNG (defaul)
		// let dataURL = canvas.toDataURL();

		// Image JPEG in base64 format with quality (0 to 1)
		let dataURL = canvas.toDataURL('image/jpeg', quality);
		// console.log(dataURL);

		// Calculate image size
		const new_size = calcImageSize(dataURL);
		setImageSize(new_size);

		document.querySelector('#download').href = dataURL;
		document.querySelector('#hidden').classList.remove('hidden');

		setTimeout(() => {
			document.querySelector('#hidden').classList.add('hidden');
		}, 5000);
	};

	// Calculate image base64 size in KB
	const calcImageSize = (image) => {
		let y = 1;
		if (image.endsWith('==')) {
			y = 2;
		}
		const x_size = image.length * (3 / 4) - y;
		return Math.round(x_size / 1024);
	};

	// NEW IMAGE - Compressed
	useEffect(() => {
		const newImage = new Image();
		newImage.src = previewIMG;
		newImage.onload = (e) => {
			setImage(newImage);
			let scaleFactor = widthValue / e.target.width;
			setHeightValue(e.target.height * scaleFactor);
		};
	}, [previewIMG, widthValue, setHeightValue]);

	useEffect(() => {
		if (image && canvas) {
			const ctx = canvas.current.getContext('2d');

			// Canvas container
			ctx.fillRect(0, 0, widthValue, heightValue);

			// Canvas background color
			ctx.fillStyle = backColor;

			// draw image in canvas with margin
			if (margin) {
				// Add image
				ctx.drawImage(
					image,
					fontSize * 2,
					fontSize * 2,
					widthValue - fontSize * 4,
					heightValue - fontSize * 4
				);
			} else {
				// Add image
				ctx.drawImage(image, 0, 0, widthValue, heightValue);
			}

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
		margin,
		bottomText,
		previewIMG,
		textColor,
		backColor,
		widthValue,
		heightValue,
		fontSize,
		fontFamily,
	]);

	return (
		<section className='meme-container'>
			<h1>Your Meme Generator!</h1>

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
						<label>
							3. Remove Border Margin:
							<input
								className='checkbox'
								type='checkbox'
								value={margin}
								onChange={handleMargin}
							></input>
						</label>
						<div>
							<label>4. Output Image max size:</label>
							<select onChange={(e) => setMaxValue(e.target.value)}>
								<option value='1024'>1024px</option>
								<option value='768'>768px</option>
								<option value='600'>600px</option>
								<option value='450'>450px</option>
							</select>
						</div>
					</div>
					<div className='text-container'>
						<label>5. Image Quality: {(quality * 100).toFixed(0)}%</label>
						<input
							id='quality'
							type='range'
							min='0.2'
							max='1'
							step='0.01'
							value={quality}
							onChange={handleImageQuality}
						/>
					</div>

					<div className='text-container'>
						<div>
							<label>6. Top Text: </label>
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
							<label>7. Bottom Text: </label>
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
							<label>8. Font Size: </label>
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
							<label>9. Font Family: </label>
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
						<button className='btn__click reset' onClick={reset}>
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
				<label htmlFor='uploader' className='btn__click'>
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
						<span className='btn__click' onClick={getCanvasIMG}>
							PROCESS: Meme to JPEG
						</span>

						<div className='hidden' id='hidden'>
							<div className='image-data'>
								<h3>
									<b>{widthValue}</b>px X <b>{heightValue}</b>px _
									{(quality * 100).toFixed(0)}%_{imageSize.toFixed(0)}KB
								</h3>
							</div>

							<a
								href={document.getElementById('canvas')}
								download='myMeme'
								id='download'
								className='btn__click'
							>
								Download Image
							</a>
						</div>
					</>
				)}
			</div>
		</section>
	);
};
