import { Link, routes } from "@redwoodjs/router";
import { Toaster } from "@redwoodjs/web/toast";

interface AdminLayoutProps {
  title: string;
  titleTo: keyof typeof routes;
  buttonLabel: string;
  buttonTo: keyof typeof routes;
  children: React.ReactNode;
}

const AdminLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
}: AdminLayoutProps) => {
  return (
    <div className="rw-scaffold">
      <Toaster toastOptions={{ className: "rw-toast", duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes[titleTo]()} className="rw-link">
            {title}
          </Link>
        </h1>
        <Link to={routes[buttonTo]()} className="rw-button rw-button-green">
          <div className="rw-button-icon">+</div> {buttonLabel}
        </Link>
      </header>
      <main className="rw-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
