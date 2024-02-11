import styles from "./Footer.module.css"

function Footer() {
  return (
    <fotter className={styles.footer}>
      <p className={styles.copyright}>
        &copy; Copyright {new Date().getFullYear()} by SeeThroughWorld Inc.
      </p>
    </fotter>
  )
}

export default Footer
