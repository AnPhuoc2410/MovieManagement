using FSK.Repository.Models;
using FSK.Repository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MovieManagement.Server.Extensions
{
    public class UnitOfWork
    {
        private readonly SWP391FengShuiKoiSystemContext _context;
        private UserRepository _userRepository;
        private AdvertisementRepository _advertisementRepository;
        private PackageRepository _packageRepository;
        private TransactionRepository _transactionRepository;
        private AuspiciousRepository _auspiciousRepository;
        private ColorRepository _colorRepository;
        private DirectionGroupRepository _directionGroupRepository;
        private DirectionRepository _directionRepository;
        private ElementColorRepository _elementColorRepository;
        private ElementQuantityRepository _elementQuantityRepository;
        private ElementRepository _elementRepository;
        private GeneralRepository _generalRepository;
        private InauspiciousRepository _inauspiciousRepository;
        private KuaRepository _kuaRepository;
        private PatternColorRepository _patternColorRepository;
        private PatternRepository _patternRepository;
        private PondRepository _pondRepository;
        private ShapeRepository _shapeRepository;
        private VarietyRepository _varietyRepository;
        private StatusRepository _statusRepository;
        private RoleRepository _roleRepository;
        private AdsTypeRepository _adsTypeRepository;
        private BlogRepository _blogRepository;
        private InteractRepository _interactRepository;

        public UnitOfWork() => _context ??= new SWP391FengShuiKoiSystemContext();




        public UserRepository UserRepository
        {
            get { return _userRepository ??= new UserRepository(_context); }
        }

        public AdvertisementRepository AdvertisementRepository
        {
            get { return _advertisementRepository ??= new AdvertisementRepository(_context); }
        }

        public PackageRepository PackageRepository
        {
            get { return _packageRepository ??= new PackageRepository(_context); }
        }

        public TransactionRepository TransactionRepository
        {
            get { return _transactionRepository ??= new TransactionRepository(_context); }
        }

        public AuspiciousRepository AuspiciousRepository
        {
            get { return _auspiciousRepository ??= new AuspiciousRepository(_context); }
        }

        public ColorRepository ColorRepository
        {
            get { return _colorRepository ??= new ColorRepository(_context); }
        }

        public DirectionGroupRepository DirectionGroupRepository
        {
            get { return _directionGroupRepository ??= new DirectionGroupRepository(_context); }
        }

        public DirectionRepository DirectionRepository
        {
            get { return _directionRepository ??= new DirectionRepository(_context); }
        }

        public ElementColorRepository ElementColorRepository
        {
            get { return _elementColorRepository ??= new ElementColorRepository(_context); }
        }

        public ElementQuantityRepository ElementQuantityRepository
        {
            get { return _elementQuantityRepository ??= new ElementQuantityRepository(_context); }
        }

        public ElementRepository ElementRepository
        {
            get { return _elementRepository ??= new ElementRepository(_context); }
        }

        public GeneralRepository GeneralRepository
        {
            get { return _generalRepository ??= new GeneralRepository(_context); }
        }

        public InauspiciousRepository InauspiciousRepository
        {
            get { return _inauspiciousRepository ??= new InauspiciousRepository(_context); }
        }

        public KuaRepository KuaRepository
        {
            get { return _kuaRepository ??= new KuaRepository(_context); }
        }

        public PatternColorRepository PatternColorRepository
        {
            get { return _patternColorRepository ??= new PatternColorRepository(_context); }
        }

        public PatternRepository PatternRepository
        {
            get { return _patternRepository ??= new PatternRepository(_context); }
        }

        public PondRepository PondRepository
        {
            get { return _pondRepository ??= new PondRepository(_context); }
        }

        public ShapeRepository ShapeRepository
        {
            get { return _shapeRepository ??= new ShapeRepository(_context); }
        }

        public VarietyRepository VarietyRepository
        {
            get { return _varietyRepository ??= new VarietyRepository(_context); }
        }

        public StatusRepository StatusRepository
        {
            get { return _statusRepository ??= new StatusRepository(_context); }
        }

        public RoleRepository RoleRepository
        {
            get { return _roleRepository ??= new RoleRepository(_context); }
        }

        public AdsTypeRepository AdsTypeRepository
        {
            get { return _adsTypeRepository ??= new AdsTypeRepository(_context); }
        }

        public BlogRepository BlogRepository
        {
            get { return _blogRepository ??= new BlogRepository(_context); }
        }

        public InteractRepository InteractRepository
        {
            get { return _interactRepository ??= new InteractRepository(_context); }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}