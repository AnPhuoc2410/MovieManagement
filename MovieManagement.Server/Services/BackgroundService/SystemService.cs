using MovieManagement.Server.Data;
using System.Threading;

namespace MovieManagement.Server.Services
{
    public interface IUnitOfWorkFactory
    {
        IUnitOfWork Create();
    }

    public class UnitOfWorkFactory : IUnitOfWorkFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public UnitOfWorkFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IUnitOfWork Create()
        {
            return _serviceProvider.GetRequiredService<IUnitOfWork>();
        }
    }

    public class SystemService : BackgroundService
    {
        private readonly ILogger<SystemService> _logger;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        private Timer _timer;

        public SystemService(ILogger<SystemService> logger, IUnitOfWorkFactory unitOfWorkFactory)
        {
            _logger = logger;
            _unitOfWorkFactory = unitOfWorkFactory;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SystemService is starting.");

            stoppingToken.Register(() => _logger.LogInformation("SystemService is stopping."));

            ScheduleTask();

            return Task.CompletedTask;
        }

        private void ScheduleTask()
        {
            DateTime now = DateTime.Now;
            DateTime nextOneAM = now.Date.AddDays(now.Hour >= 1 ? 1 : 0).AddHours(1); // Next occurrence of 1 AM
            TimeSpan timeToOneAM = nextOneAM - now;

            _logger.LogInformation($"Scheduling RemoveTicketDaily to run at {nextOneAM} (in {timeToOneAM}).");

            _timer = new Timer(RemoveTicketDaily, null, timeToOneAM, TimeSpan.FromDays(1));
        }

        private async void RemoveTicketDaily(object state)
        {
            _logger.LogInformation("RemoveTicketDaily is running.");

            try
            {
                using (var unitOfWork = _unitOfWorkFactory.Create())
                {
                    var tickets = await unitOfWork.TicketDetailRepository.GetRemainingsTickets();
                    foreach (var ticket in tickets)
                    {
                        unitOfWork.TicketDetailRepository.PrepareRemove(ticket);
                    }
                    await unitOfWork.TicketDetailRepository.SaveAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while removing tickets.");
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("SystemService is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            await base.StopAsync(cancellationToken);
        }
    }
}
