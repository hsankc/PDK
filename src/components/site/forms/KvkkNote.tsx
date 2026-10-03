/** Form onay kutularına eklenen KVKK cümlesi ve aydınlatma metni bağlantısı. */
export function KvkkNote() {
  return (
    <>
      Verilerimin bu amaçla yurt dışındaki sunucularda saklanmasına onay veriyorum (
      <a
        href="/kvkk"
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand font-bold underline underline-offset-2"
      >
        KVKK aydınlatma metni
      </a>
      ).
    </>
  );
}
