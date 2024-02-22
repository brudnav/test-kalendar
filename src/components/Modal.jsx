import styles from "../css/Modal.module.css"

function Modal({ open, children, onClose }) {

    if (!open) return null;

    return (
        <>
            <div className={styles.overlay} />
            <div className={styles.modal}>
                <button className='delete is-large' onClick={onClose}></button>
                {children}
            </div>
        </>
    )
}

export default Modal