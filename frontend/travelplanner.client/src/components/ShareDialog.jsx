import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import shareService from '../services/shareService';
import ConfirmDialog from './ConfirmDialog';

export default function ShareDialog({ tripId, open, onClose }) {
  const [shares, setShares] = useState([]);
  const [accessType, setAccessType] = useState('VIEW');
  const [expiryDays, setExpiryDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedShare, setSelectedShare] = useState(null);
  const [confirmToken, setConfirmToken] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setShares(await shareService.getByTrip(tripId));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      load();
      setSelectedShare(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tripId]);

  if (!open) return null;

  // Link ka javnoj stranici deljenog plana.
  function buildShareUrl(token) {
    return `${window.location.origin}/shared/${token}`;
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const days = expiryDays !== '' ? Number(expiryDays) : null;
      const share = await shareService.create(tripId, accessType, days);
      setSelectedShare(share);
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke() {
    await shareService.revoke(tripId, confirmToken);
    setConfirmToken(null);
    if (selectedShare?.token === confirmToken) setSelectedShare(null);
    await load();
  }

  function copyLink(token) {
    navigator.clipboard.writeText(buildShareUrl(token));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>Podeli plan putovanja</h3>

        <div className="share-create">
          <div className="form-row">
            <div className="form-group">
              <label>Nivo pristupa</label>
              <select value={accessType} onChange={(e) => setAccessType(e.target.value)}>
                <option value="VIEW">Samo pregled (VIEW)</option>
                <option value="EDIT">Pregled i izmena (EDIT)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ističe za (dana, opciono)</label>
              <input
                type="number"
                min="1"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                placeholder="npr. 7"
              />
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating}>
            {creating ? 'Kreiranje...' : 'Kreiraj link za deljenje'}
          </button>
        </div>

        {selectedShare && (
          <div className="share-qr">
            <QRCodeCanvas value={buildShareUrl(selectedShare.token)} size={180} />
            <div className="share-link">
              <input readOnly value={buildShareUrl(selectedShare.token)} />
              <button className="btn-small" onClick={() => copyLink(selectedShare.token)}>
                Kopiraj
              </button>
            </div>
            <span className="share-access-badge">
              {selectedShare.accessType === 'EDIT' ? 'Pregled i izmena' : 'Samo pregled'}
            </span>
          </div>
        )}

        <div className="share-list">
          <h4>Aktivni linkovi</h4>
          {loading ? (
            <p className="overview-muted">Učitavanje...</p>
          ) : shares.length === 0 ? (
            <p className="overview-muted">Nema aktivnih linkova za deljenje.</p>
          ) : (
            shares.map((s) => (
              <div key={s.token} className="share-row">
                <div>
                  <span className="share-access-badge">
                    {s.accessType === 'EDIT' ? 'EDIT' : 'VIEW'}
                  </span>
                  <span className="share-token-short">…{s.token.slice(-8)}</span>
                  {s.expiresAt && (
                    <span className="share-expiry">
                      ističe {new Date(s.expiresAt).toLocaleDateString('sr-Latn')}
                    </span>
                  )}
                </div>
                <div className="share-row-actions">
                  <button className="btn-small" onClick={() => setSelectedShare(s)}>QR</button>
                  <button className="btn-small" onClick={() => copyLink(s.token)}>Kopiraj</button>
                  <button className="btn-small btn-danger" onClick={() => setConfirmToken(s.token)}>
                    Opozovi
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Zatvori</button>
        </div>

        <ConfirmDialog
          open={confirmToken !== null}
          title="Opoziv linka"
          message="Da li si siguran? Link više neće raditi nakon opoziva."
          onConfirm={handleRevoke}
          onCancel={() => setConfirmToken(null)}
        />
      </div>
    </div>
  );
}