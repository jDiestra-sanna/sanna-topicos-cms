import FuseAnimate from '@fuse/core/FuseAnimate';
import { Box } from '@material-ui/core';
import Button from 'widgets/sanna/Button';
import React, { useEffect, useState } from 'react';
import picOffLine from './offLine.png';
import picOffLineText from './offLineText.png';

export default function OffLine(props) {
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	useEffect(() => {
		const handleOnlineStatusChange = () => {
			setIsOnline(navigator.onLine);
		};

		window.addEventListener('online', handleOnlineStatusChange);
		window.addEventListener('offline', handleOnlineStatusChange);

		return () => {
			window.removeEventListener('online', handleOnlineStatusChange);
			window.removeEventListener('offline', handleOnlineStatusChange);
		};
	}, []);

	return (
		<>
			{isOnline ? (
				props.children
			) : (
				<Box className="w-full h-full bg-white flex justify-center items-center">
					<FuseAnimate animation={{ translateY: [0, '100%'] }}>
						<Box className="flex flex-col items-center" style={{ width: '500px' }}>
							<Box className="mb-24">
								<img src={picOffLine} />
							</Box>

							<Box className="mb-24">
								<img src={picOffLineText} />
							</Box>

							<Button onClick={() => window.location.reload()}>Intentar nuevamente</Button>
						</Box>
					</FuseAnimate>
				</Box>
			)}
		</>
	);
}
