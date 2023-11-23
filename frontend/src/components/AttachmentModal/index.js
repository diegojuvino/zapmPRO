import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";


const AttachmentModal = ({ title, open, onClose, imgUrl }) => {

	const returnFileTypeFromUrlExt = (url) => {
		if (!url) return;
		const ext = url?.split('.').pop();
		return ext;
	}
	return (
		<Dialog
			open={open}
			onClose={() => onClose(false)}
			aria-labelledby="confirm-dialog"
			maxWidth="lg"
		>
			<DialogTitle id="confirm-dialog">{title}</DialogTitle>
			<DialogContent dividers>
				{returnFileTypeFromUrlExt(imgUrl) === 'pdf' ? ( 
					<embed src={imgUrl} width="1080px" height="720px" />
				) : (
					<img src={imgUrl} alt="attachment" width="100%" height="100%" />
				)}
			
			</DialogContent>
		</Dialog>
	);
};

export default AttachmentModal;
