package com.ecommerce.backend;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() > 5) return;

        User vendor = userRepository.findByEmail("vendor@gmail.com")
                .orElseGet(() -> {
                    User v = new User();
                    v.setName("Test Vendor");
                    v.setEmail("vendor@gmail.com");
                    v.setPassword(passwordEncoder.encode("123456"));
                    v.setRole(User.Role.VENDOR);
                    return userRepository.save(v);
                });

        List<Product> products = List.of(

            // MOBILES
            makeProduct("iPhone 15 Pro", "Latest Apple flagship phone", 134999.0, 30, "Mobile",
                "https://images.unsplash.com/photo-1696446702183-cbd29ae90862?w=400", vendor),
            makeProduct("Samsung Galaxy S24", "Samsung flagship with AI features", 89999.0, 25, "Mobile",
                "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", vendor),
            makeProduct("OnePlus 12", "Flagship killer with fast charging", 64999.0, 40, "Mobile",
                "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400", vendor),
            makeProduct("Xiaomi 14", "Leica camera smartphone", 59999.0, 35, "Mobile",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", vendor),
            makeProduct("Realme GT 6", "Gaming smartphone under 40k", 39999.0, 50, "Mobile",
                "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400", vendor),
            makeProduct("Vivo V30 Pro", "Best camera phone mid range", 44999.0, 45, "Mobile",
                "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400", vendor),
            makeProduct("Oppo Reno 11", "Slim design portrait camera", 34999.0, 60, "Mobile",
                "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400", vendor),
            makeProduct("Google Pixel 8", "Pure Android AI camera", 75999.0, 20, "Mobile",
                "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400", vendor),
            makeProduct("Nothing Phone 2", "Unique glyph interface phone", 44999.0, 30, "Mobile",
                "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400", vendor),
            makeProduct("Motorola Edge 50", "Stock Android experience", 29999.0, 55, "Mobile",
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400", vendor),
            makeProduct("iQOO 12", "Gaming beast with 144Hz", 52999.0, 35, "Mobile",
                "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400", vendor),
            makeProduct("Samsung Galaxy A55", "Best mid range Samsung", 34999.0, 70, "Mobile",
                "https://images.unsplash.com/photo-1533228100845-08145b01de14?w=400", vendor),
            makeProduct("iPhone 14", "Previous gen Apple flagship", 79999.0, 25, "Mobile",
                "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=400", vendor),
            makeProduct("Redmi Note 13 Pro", "Budget king with AMOLED", 24999.0, 80, "Mobile",
                "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400", vendor),
            makeProduct("Poco X6 Pro", "Performance beast budget phone", 27999.0, 65, "Mobile",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", vendor),
            makeProduct("Nokia G42", "Pure Android budget phone", 14999.0, 90, "Mobile",
                "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400", vendor),
            makeProduct("Lava Blaze 2", "Made in India budget phone", 9999.0, 100, "Mobile",
                "https://images.unsplash.com/photo-1609252925146-8f8f7e5a8e58?w=400", vendor),
            makeProduct("Samsung Galaxy M55", "Long battery life phone", 26999.0, 55, "Mobile",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400", vendor),
            makeProduct("Infinix Note 40", "Fastest charging budget phone", 16999.0, 75, "Mobile",
                "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=400", vendor),
            makeProduct("Tecno Spark 20", "Entry level 4G phone", 8999.0, 120, "Mobile",
                "https://images.unsplash.com/photo-1636051028886-0059ad2383c8?w=400", vendor),

            // LAPTOPS
            makeProduct("MacBook Pro M3", "Apple silicon powerhouse", 199999.0, 15, "Laptop",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", vendor),
            makeProduct("Dell XPS 15", "Premium Windows laptop", 154999.0, 20, "Laptop",
                "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", vendor),
            makeProduct("HP Spectre x360", "2-in-1 convertible laptop", 134999.0, 18, "Laptop",
                "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400", vendor),
            makeProduct("Lenovo ThinkPad X1", "Business laptop excellence", 144999.0, 12, "Laptop",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400", vendor),
            makeProduct("ASUS ROG Strix G16", "Gaming laptop beast", 129999.0, 25, "Laptop",
                "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400", vendor),
            makeProduct("Acer Predator Helios", "4K gaming laptop", 119999.0, 20, "Laptop",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", vendor),
            makeProduct("MSI Raider GE78", "Extreme gaming performance", 174999.0, 10, "Laptop",
                "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400", vendor),
            makeProduct("Samsung Galaxy Book4", "Slim premium Windows laptop", 89999.0, 30, "Laptop",
                "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400", vendor),
            makeProduct("MacBook Air M2", "Thin light powerful laptop", 114999.0, 35, "Laptop",
                "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400", vendor),
            makeProduct("Lenovo IdeaPad Slim 5", "Best budget laptop", 54999.0, 45, "Laptop",
                "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400", vendor),
            makeProduct("HP Pavilion 15", "Value for money laptop", 49999.0, 50, "Laptop",
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400", vendor),
            makeProduct("Dell Inspiron 15", "Everyday use laptop", 44999.0, 60, "Laptop",
                "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400", vendor),
            makeProduct("ASUS VivoBook 16", "Slim affordable laptop", 42999.0, 55, "Laptop",
                "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400", vendor),
            makeProduct("Acer Swift 3", "Ultra thin budget laptop", 38999.0, 65, "Laptop",
                "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400", vendor),
            makeProduct("Mi Notebook Pro", "Value flagship laptop", 59999.0, 40, "Laptop",
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400", vendor),

            // HEADPHONES
            makeProduct("Sony WH-1000XM5", "Best ANC headphones", 29999.0, 40, "Headphone",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", vendor),
            makeProduct("Bose QuietComfort 45", "Premium noise cancelling", 27999.0, 35, "Headphone",
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", vendor),
            makeProduct("Apple AirPods Max", "Apple premium headphones", 59999.0, 20, "Headphone",
                "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400", vendor),
            makeProduct("Samsung Galaxy Buds2 Pro", "Premium TWS earbuds", 14999.0, 50, "Headphone",
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", vendor),
            makeProduct("JBL Tour One M2", "JBL flagship headphones", 19999.0, 45, "Headphone",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400", vendor),
            makeProduct("Sennheiser Momentum 4", "Audiophile headphones", 32999.0, 25, "Headphone",
                "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400", vendor),
            makeProduct("OnePlus Buds Pro 2", "Best budget ANC buds", 9999.0, 60, "Headphone",
                "https://images.unsplash.com/photo-1631176093617-1bb1b8acb83b?w=400", vendor),
            makeProduct("Boat Rockerz 550", "Bass heavy headphones", 1999.0, 100, "Headphone",
                "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400", vendor),
            makeProduct("Sony WF-1000XM5", "Best TWS earbuds 2024", 19999.0, 40, "Headphone",
                "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400", vendor),
            makeProduct("Noise Buds VS104", "Budget TWS earbuds India", 1499.0, 150, "Headphone",
                "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400", vendor),

            // MEN FASHION
            makeProduct("Levi's 511 Slim Jeans", "Classic slim fit jeans", 3999.0, 80, "Men Fashion",
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", vendor),
            makeProduct("Allen Solly Formal Shirt", "Premium cotton formal shirt", 1999.0, 100, "Men Fashion",
                "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400", vendor),
            makeProduct("Nike Dri-FIT T-Shirt", "Sports performance tee", 1499.0, 120, "Men Fashion",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", vendor),
            makeProduct("Peter England Trousers", "Formal office trousers", 2499.0, 90, "Men Fashion",
                "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", vendor),
            makeProduct("Adidas Ultraboost Shoes", "Premium running shoes", 12999.0, 60, "Men Fashion",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", vendor),
            makeProduct("Ray-Ban Aviator Sunglasses", "Classic aviator style", 6999.0, 50, "Men Fashion",
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400", vendor),
            makeProduct("Tommy Hilfiger Polo", "Premium polo t-shirt", 3499.0, 70, "Men Fashion",
                "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400", vendor),
            makeProduct("Woodland Casual Shoes", "Durable casual footwear", 4999.0, 85, "Men Fashion",
                "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400", vendor),

            // WOMEN FASHION
            makeProduct("Anita Dongre Kurta Set", "Designer ethnic wear", 4999.0, 60, "Women Fashion",
                "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400", vendor),
            makeProduct("Banarasi Silk Saree", "Traditional wedding saree", 8999.0, 40, "Women Fashion",
                "https://images.unsplash.com/photo-1610189020318-8abd6e8b7a4f?w=400", vendor),
            makeProduct("Lehenga Choli Set", "Festive occasion wear", 12999.0, 30, "Women Fashion",
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400", vendor),
            makeProduct("Cotton Casual Top", "Everyday comfortable top", 999.0, 150, "Women Fashion",
                "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400", vendor),
            makeProduct("Zara Floral Dress", "Western casual dress", 2999.0, 80, "Women Fashion",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", vendor),
            makeProduct("H&M Denim Jacket", "Trendy denim outerwear", 3499.0, 70, "Women Fashion",
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", vendor),
            makeProduct("Nike Women Sneakers", "Stylish sports shoes", 7999.0, 55, "Women Fashion",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", vendor),
            makeProduct("Fossil Women Watch", "Elegant wrist watch", 9999.0, 45, "Women Fashion",
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", vendor)
        );

        productRepository.saveAll(products);
        System.out.println("✅ " + products.size() + " products seeded successfully!");
    }

    private Product makeProduct(String name, String desc, Double price,
                                 Integer stock, String category,
                                 String imageUrl, User vendor) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setStock(stock);
        p.setCategory(category);
        p.setImageUrl(imageUrl);
        p.setVendor(vendor);
        return p;
    }
}