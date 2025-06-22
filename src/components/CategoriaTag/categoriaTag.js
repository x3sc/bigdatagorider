import styles from "../CategoriaTag/categoriaTag.module.css";

export default function CategoriaTag({ Text = "", customStyle = {} }) {
  return <div className="tag">{Text}</div>;
}
