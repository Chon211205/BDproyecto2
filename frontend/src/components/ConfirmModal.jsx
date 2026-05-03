function ConfirmModal({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modalOverlay">
      <div className="modalCard">
        <h2>{titulo}</h2>
        <p>{mensaje}</p>

        <div className="modalActions">
          <button className="secondaryButton" onClick={onCancelar}>
            Cancelar
          </button>

          <button className="dangerButton" onClick={onConfirmar}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal