import { FC, ReactNode, useState } from 'react'
import './Modal.css'

type ModalProps = {
    title: string
    onClose: () => void
    children: ReactNode
}

const Modal = () => {

    const [showLegal, setShowLegal] = useState(false)

    return showLegal ? (
        <div className="modal_backdrop" onClick={() => setShowLegal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal_header">
                    <h2 className="modal_title">Legal</h2>
                    <button className="modal_close" onClick={() => setShowLegal(false)}>✕</button>
                </div>
                <div className="modal_body">
                    <p>
                        "Old TV" <a target='_blank' href='https://skfb.ly/onSF9'>https://skfb.ly/onSF9</a> by pibanezl is licensed under Creative Commons Attribution.
                    </p>
                    <p>
                        "Dendy Junior draft" <a target='_blank' href='https://skfb.ly/6XXtI'>https://skfb.ly/6XXtI</a> by I.Gartsevich is licensed under Creative Commons Attribution.
                    </p>
                    <p>
                        "Minecraft - Chicken" <a target='_blank' href='https://skfb.ly/6R76D'>https://skfb.ly/6R76D</a> by Vincent Yanez is licensed under Creative Commons Attribution.
                    </p>

                    <a target='_blank' href='http://creativecommons.org/licenses/by/4.0/'>http://creativecommons.org/licenses/by/4.0/</a>
                </div>
            </div>
        </div>
    ) : (
        <button onClick={() => setShowLegal(true)} className="legal_button">
            <img src="/images/legal.png" width={35} height={35} />
        </button>
    )
}

export default Modal
