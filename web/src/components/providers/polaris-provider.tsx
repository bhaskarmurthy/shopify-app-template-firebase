import { PropsWithChildren, useCallback } from "react";
import { AppProvider, LinkProps } from "@shopify/polaris";
import { useNavigate } from "@shopify/app-bridge-react";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { LinkLikeComponentProps } from "@shopify/polaris/build/ts/latest/src/utilities/link";

function AppBridgeLink({
  url,
  children,
  external,
  ...rest
}: LinkLikeComponentProps) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(url);
  }, [url]);

  const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    return (
      <a target="_blank" rel="noopener noreferrer" href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/**
 * Sets up the AppProvider from Polaris.
 * @desc PolarisProvider passes a custom link component to Polaris.
 * The Link component handles navigation within an embedded app.
 * Prefer using this vs any other method such as an anchor.
 * Use it by importing Link from Polaris, e.g:
 *
 * ```
 * import {Link} from '@shopify/polaris'
 *
 * function MyComponent() {
 *  return (
 *    <div><Link url="/tab2">Tab 2</Link></div>
 *  )
 * }
 * ```
 *
 * PolarisProvider also passes translations to Polaris.
 *
 */
export function PolarisProvider({ children }: PropsWithChildren<{}>) {
  return (
    <AppProvider i18n={translations} linkComponent={AppBridgeLink}>
      {children}
    </AppProvider>
  );
}
