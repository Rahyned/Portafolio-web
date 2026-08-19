export default function Toast({ message, show }) {
  return (
    <div className={`konami-toast${show ? " show" : ""}`} role="status">
      {message}
    </div>
  );
}
