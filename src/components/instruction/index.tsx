import styles from "./styles.module.css";

type Instruct = {
  example: string;
  desc: string;
  share: string;
};

const Introduction = ({ desc, example, share }: Instruct) => {
  return (
    <>
      <p className={styles.desc}>
        {desc}
      </p>
      <p className={styles.example}>
        {example}
      </p>
      <p className={styles.share}>{
        share}
      </p>
    </>
  );
};

export default Introduction;
