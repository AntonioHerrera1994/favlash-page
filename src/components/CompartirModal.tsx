import { useState } from 'react';
import Modal from './Modal';
import { IconCopy, IconCheck } from './icons';

type Props = {
  onCerrar: () => void;
};

export default function CompartirModal({ onCerrar }: Props) {
  const [copiadoLink, setCopiadoLink] = useState(false);
  const [copiadoEmbed, setCopiadoEmbed] = useState(false);

  // En desarrollo local esto será localhost; en producción, tu dominio real.
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${base}/agendar`;
  const embedCode = `<iframe src="${base}/agendar?embed=1" width="420" height="720" style="border:none;"></iframe>`;

  function copiar(texto: string, marcar: (v: boolean) => void) {
    navigator.clipboard.writeText(texto);
    marcar(true);
    setTimeout(() => marcar(false), 2000);
  }

  return (
    <Modal onClose={onCerrar} width="440px">
      <h2 className="modal-titulo">Compartir agenda</h2>
      <p className="compartir-intro">
        Cualquiera con este link puede ver tus servicios y agendar una cita — sin necesitar cuenta.
      </p>

      <label className="campo-label">
        Link para compartir (WhatsApp, redes, etc.)
        <div className="compartir-campo">
          <input className="input-oscuro" readOnly value={link} onFocus={(e) => e.target.select()} />
          <button className="btn-secundario compartir-btn-copiar" onClick={() => copiar(link, setCopiadoLink)}>
            {copiadoLink ? <IconCheck size={14} /> : <IconCopy />}
            {copiadoLink ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </label>

      <label className="campo-label" style={{ marginTop: '1.1rem' }}>
        Código para incrustar como iframe en otra página
        <div className="compartir-campo">
          <textarea className="textarea-oscuro" readOnly rows={3} value={embedCode} onFocus={(e) => e.target.select()} />
        </div>
        <button className="btn-secundario compartir-btn-copiar" onClick={() => copiar(embedCode, setCopiadoEmbed)}>
          {copiadoEmbed ? <IconCheck size={14} /> : <IconCopy />}
          {copiadoEmbed ? 'Copiado' : 'Copiar código'}
        </button>
      </label>

      <p className="compartir-nota">
        El modo iframe (<code>?embed=1</code>) oculta el link de "volver a FavLash".
      </p>
    </Modal>
  );
}