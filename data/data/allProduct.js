import mariab from "./mariaB.json";
import limelight from "./limelight.json";
import sapphire from "./sapphire.json";
import gulAhmed from "./gulAhmed.json";
import edenrobe from "./edenrobe.json";
import beechtree from "./beechtree.json";
import junaidJamshed from "./junaidJamshed.json";
import outfitters from "./outfitters.json";
import khaadi from "./khaadi.json";
import bonanza from "./bonanza.json";

// merge all brands in one array
const allProducts = [
  ...mariab,
  ...limelight,
  ...sapphire,
  ...gulAhmed,
  ...edenrobe,
  ...beechtree,
  ...junaidJamshed,
  ...outfitters,
  ...khaadi,
  ...bonanza,
];

// give unique numeric id to every product
allProducts.forEach((p, index) => {
  p.id = index.toString();
});

export default allProducts;
